"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { DB } from "../../lib/firebaseConfig";
import { useUser } from "../../lib/auth";
import { ALL_GRADES, GRADE_GROUPS, GRADES_WITH_SPECIALIZATION, SPECIALIZATIONS } from "../../lib/liveGrades";
import { ALL_SUBJECTS, getSubjectsForGrade } from "../../lib/liveSubjects";
import { CONTENT_TYPES, contentTypeOf, PDF_CATEGORIES, getPdfCategory } from "../../lib/videoConfig";
import LoadingSpinner from "./LoadingSpinner";
import { ContentCard, PlayerModal, PdfReaderModal } from "./DocumentCards";
import { AccessModal } from "./AccessModal";
import { useSubscription, claimAccess } from "../../lib/useSubscription";
import { isFreeAccess } from "../../lib/subscription";
import { isOpenDoc } from "../../lib/openDocs";
import { getGradeEmoji, getSubjectEmoji } from "../../lib/videoDisplay";
import { normalizeText } from "../../lib/videoText";
import "../homePage.css";
import "../videos/videos.css";
import "./catalogFilters.css";
import "./openDocs.css"; 
const DROUSSY_WHATSAPP = "21651510183";
const TEACHER_JOIN_LINK = `https://wa.me/${DROUSSY_WHATSAPP}?text=${encodeURIComponent(
  "Bonjour, je souhaite devenir enseignant sur Droussy TN"
)}`;

// Documents are fetched from Firestore 40 at a time ("Voir plus" loads the next 40).
// 40 fills every row of the 4-column (computer) and 2-column (tablet) grids,
// so the last row never looks like the end of the catalog.
// Filters and sorting run in the Firestore query itself, so each batch is always the
// right 40 for the current filters — not 40 random docs filtered afterwards.
const BATCH_SIZE = 40;

// Grades in curriculum order (1ère année → Bac).
const ORDERED_GRADES = GRADE_GROUPS.flatMap((group) =>
  group.grades.map((g) => ({ ...g, levelName: group.levelName }))
);

const TYPE_FILTERS = [
  { id: "all", label: "Tout" },
  { id: CONTENT_TYPES.VIDEO, label: "🎬 Vidéos" },
  { id: CONTENT_TYPES.PDF, label: "📄 PDF" },
];

// ---------- Helpers ----------

function gradeById(id) {
  return ORDERED_GRADES.find((g) => g.id === id) || ALL_GRADES.find((g) => g.id === id) || null;
}

function gradeEmoji(id) {
  return getGradeEmoji(id);
}

const isPdf = (item) => contentTypeOf(item) === CONTENT_TYPES.PDF;

// "3 vidéos", "1 PDF", "5 contenus"
function countLabel(n, type) {
  if (type === CONTENT_TYPES.VIDEO) return `${n} vidéo${n > 1 ? "s" : ""}`;
  if (type === CONTENT_TYPES.PDF) return `${n} PDF`;
  return `${n} contenu${n > 1 ? "s" : ""}`;
}

/** Firestore filters for the current view (published only — what the rules allow). */
function filterConstraints({ grade, section, subject, type, docCategory, teacherId, free }) {
  const c = [where("status", "==", "published")];
  if (teacherId) c.push(where("teacherId", "==", teacherId));
  if (free) c.push(where("isOpen", "==", true)); // "Gratuit" filter
  if (grade !== "all") c.push(where("gradeId", "==", grade));
  if (section !== "all") c.push(where("specializationId", "==", section));
  if (type !== "all") c.push(where("type", "==", type));
  if (type === CONTENT_TYPES.PDF && docCategory !== "all") c.push(where("pdfCategory", "==", docCategory));
  if (subject !== "all") c.push(where("subjectId", "==", subject));
  return c;
} 
// No orderBy: documents come in Firestore's natural order (by document id),
// and "Voir plus" continues from the last one loaded.

// ---------- Search ----------
// Documents carry `searchKeywords`: the normalized words of their title, subject,
// teacher name and grade (lib/videoText.js → buildSearchKeywords). A search is
// ONE Firestore query (array-contains-any, max 10 words) run only when the
// student presses Enter / "Rechercher" — never while typing.
const SEARCH_LIMIT = 100;
const SEARCH_MAX_WORDS = 10;

function searchWords(text) {
  return [
    ...new Set(
      normalizeText(text)
        .split(/[^\p{L}\p{N}]+/u)
        .filter((w) => w.length >= 2)
    ),
  ].slice(0, SEARCH_MAX_WORDS);
}

// Singular / plural forms, so "fraction" also finds "fractions" (and the reverse).
// Firestore accepts at most 30 values in array-contains-any.
function withVariants(words) {
  const out = new Set();
  words.forEach((w) => {
    out.add(w);
    if (w.length > 3 && /[sx]$/.test(w)) out.add(w.slice(0, -1));
    else if (w.length > 2 && /\p{L}$/u.test(w)) out.add(`${w}s`);
  });
  return [...out].slice(0, 30);
}

const sameWord = (a, b) => a === b || a === `${b}s` || b === `${a}s` || a === `${b}x` || b === `${a}x`;

/** Best matches first (words found exactly > words found as the start of a keyword); same score → database order. */
function rankResults(docs, words) {
  return docs
    .map((d) => {
      const kws = Array.isArray(d.searchKeywords) ? d.searchKeywords : [];
      const set = new Set(kws);
      let score = 0;
      words.forEach((w) => {
        if (set.has(w) || kws.some((k) => sameWord(k, w))) score += 2;
        else if (kws.some((k) => k.startsWith(w))) score += 1;
      });
      return { d, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.d);
}

// ---------- Counts (Firestore count queries: ~1 read each, no documents downloaded) ----------

async function countMatching(constraints) {
  const agg = await getCountFromServer(query(collection(DB, "videos"), ...constraints));
  return agg.data().count;
}

/** entries: [[key, constraints], …] → Map(key → count). A failed count gives null (= unknown, still shown). */
async function countMany(entries) {
  const results = await Promise.all(
    entries.map(([key, constraints]) =>
      countMatching(constraints).then(
        (n) => [key, n],
        () => [key, null]
      )
    )
  );
  return new Map(results);
}

// A chip/option is shown when it has documents (or its count failed to load).
const hasDocs = (counts, key) => !counts || counts.get(key) == null || counts.get(key) > 0; 
// Home page of the platform (app/page.js) — the documents catalog.
// Filters live in the URL (?niveau=col-7&type=pdf&doc=serie&matiere=maths&q=fractions)
// so the back button, refresh and shared links keep the same view. We use the
// History API directly to avoid Next's useSearchParams Suspense requirement.
function readUrlFilters() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const type = p.get("type");
  return {
    grade: p.get("niveau") || null,
    section: p.get("section") || "all",
    subject: p.get("matiere") || "all",
    type: type === CONTENT_TYPES.VIDEO || type === CONTENT_TYPES.PDF ? type : "all",
    docCategory: p.get("doc") || "all",
    q: (p.get("q") || "").slice(0, 80),
    free: p.get("gratuit") === "1",
  };
}

function writeUrlFilters({ grade, section, subject, type, docCategory, q, free }) {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams();
  if (grade && grade !== "all") p.set("niveau", grade);
  if (type !== "all") p.set("type", type);
  if (type === CONTENT_TYPES.PDF && docCategory !== "all") p.set("doc", docCategory);
  if (section !== "all") p.set("section", section);
  if (subject !== "all") p.set("matiere", subject);
  if (q) p.set("q", q);
  if (free) p.set("gratuit", "1");
  const qs = p.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  if (next !== `${window.location.pathname}${window.location.search}`) {
    window.history.replaceState(null, "", next);
  }
} 
// =========================================================
// PAGE
// =========================================================

/**
 * The documents catalog.
 *  - Home page: <DocumentsCatalog />
 *  - Teacher profile: <DocumentsCatalog teacherId={id} title="Documents publiés" />
 *    → same filters, search and 40-by-40 loading, limited to that teacher's documents
 *      (no hero, no "Vous êtes enseignant ?" box, filter bar not sticky).
 */
export default function DocumentsCatalog({ teacherId = null, title = null }) {
  const { user, hydrated } = useUser();
  const embedded = !!teacherId;
  // Extra Firestore filter applied to EVERY query and count of this catalog.
  const teacherScope = useMemo(() => (teacherId ? [where("teacherId", "==", teacherId)] : []), [teacherId]);

  const [grade, setGrade] = useState("all");
  const [section, setSection] = useState("all");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all"); // all | video | pdf
  const [docCategory, setDocCategory] = useState("all"); // PDF type (cours, série…)
  const [freeOnly, setFreeOnly] = useState(false); // "Gratuit" filter: open documents only
  const [searchInput, setSearchInput] = useState(""); // what the student types
  const [searchQuery, setSearchQuery] = useState(""); // what was submitted (Enter / button)
  const [filtersReady, setFiltersReady] = useState(false);

  // Loaded documents for the current filters (grows by 40 with "Voir plus").
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null); // matching documents (count query), null = unknown
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const lastDocRef = useRef(null); // cursor for the next batch
  const requestRef = useRef(0); // ignores answers to filters that changed since

  // Catalog totals for the hero line (2 tiny count queries, once).
  const [catalogTotals, setCatalogTotals] = useState(null);

  // Counts shown next to levels, sections, types, subjects and PDF types.
  const [gradeCounts, setGradeCounts] = useState(null); // Map gradeId → n (once per visit)
  const [sectionCounts, setSectionCounts] = useState(null); // Map specializationId → n
  const [typeCounts, setTypeCounts] = useState(null); // { all, video, pdf }
  const [subjectCounts, setSubjectCounts] = useState(null); // Map subjectId → n
  const [docCategoryCounts, setDocCategoryCounts] = useState(null); // Map pdfCategory → n

  const [playing, setPlaying] = useState(null);
  const [reading, setReading] = useState(null);
  const [locked, setLocked] = useState(null); // { item, reason }
  const isStudent = !!user && user.role !== "teacher";

  // Subscription: every grade and every subject (a hidden usage limit protects shared accounts).
  const { status: subStatus, refresh: refreshSub } = useSubscription(isStudent ? user : null);
  const firstName = user?.name?.split(" ")[0];

  // ---- Initial filters: from the URL, otherwise "Tous les niveaux" for everyone ----
  useEffect(() => {
    if (!hydrated || filtersReady) return;
    const fromUrl = readUrlFilters();
    setGrade(fromUrl.grade || "all");
    setSection(fromUrl.section);
    setSubject(fromUrl.subject);
    setType(fromUrl.type);
    setDocCategory(fromUrl.docCategory);
    setSearchInput(fromUrl.q);
    setSearchQuery(fromUrl.q);
    setFreeOnly(!!fromUrl.free);
    setFiltersReady(true);
  }, [hydrated, filtersReady]);

  const hasSections = grade !== "all" && GRADES_WITH_SPECIALIZATION.has(grade);
  useEffect(() => {
    if (!hasSections && section !== "all") setSection("all");
  }, [hasSections, section]);

  // The PDF-type filter only makes sense on the PDF tab.
  useEffect(() => {
    if (type !== CONTENT_TYPES.PDF && docCategory !== "all") setDocCategory("all");
  }, [type, docCategory]);

  // Subjects offered: those of the chosen grade, or all of them.
  // Candidate subjects: those of the chosen grade, or all of them.
  const subjectCandidates = useMemo(() => {
    const list = grade === "all" ? ALL_SUBJECTS : getSubjectsForGrade(grade);
    return (list || []).map((s) => ({ id: s.id, name: s.name, emoji: getSubjectEmoji(s.id, s.emoji) }));
  }, [grade]);

  // Shown: only subjects that have documents for the current level/section/type.
  const subjectChips = useMemo(
    () =>
      subjectCandidates
        .filter((s) => hasDocs(subjectCounts, s.id))
        .map((s) => ({ ...s, count: subjectCounts?.get(s.id) ?? null })),
    [subjectCandidates, subjectCounts]
  );

  // A subject that doesn't exist in the new grade — or has no documents there — falls back to "all".
  useEffect(() => {
    if (!filtersReady || subject === "all") return;
    if (!subjectCandidates.some((s) => s.id === subject)) setSubject("all");
    else if (subjectCounts && subjectCounts.get(subject) === 0) setSubject("all");
  }, [filtersReady, subject, subjectCandidates, subjectCounts]); 
  // ---- Counts ----
  // Per level: once per visit.
  useEffect(() => {
    let cancelled = false;
    countMany(
      ALL_GRADES.map((g) => [g.id, [where("status", "==", "published"), ...teacherScope, where("gradeId", "==", g.id)]])
    ).then((m) => !cancelled && setGradeCounts(m));
    return () => {
      cancelled = true;
    };
  }, [teacherScope]);

  // Per section (grades with specializations).
  useEffect(() => {
    if (!filtersReady || !hasSections) {
      setSectionCounts(null);
      return;
    }
    let cancelled = false;
    countMany(
      SPECIALIZATIONS.map((sp) => [
        sp.id,
        [where("status", "==", "published"), ...teacherScope, where("gradeId", "==", grade), where("specializationId", "==", sp.id)],
      ])
    ).then((m) => !cancelled && setSectionCounts(m));
    return () => {
      cancelled = true;
    };
  }, [filtersReady, hasSections, grade]);

  // Tout / Vidéos / PDF for the current level + section.
  useEffect(() => {
    if (!filtersReady) return;
    let cancelled = false;
    const scope = filterConstraints({ grade, section, subject: "all", type: "all", docCategory: "all", teacherId, free: freeOnly });
    countMany([
      [CONTENT_TYPES.VIDEO, [...scope, where("type", "==", CONTENT_TYPES.VIDEO)]],
      [CONTENT_TYPES.PDF, [...scope, where("type", "==", CONTENT_TYPES.PDF)]],
    ]).then((m) => {
      if (cancelled) return;
      const v = m.get(CONTENT_TYPES.VIDEO);
      const p = m.get(CONTENT_TYPES.PDF);
      setTypeCounts({
        [CONTENT_TYPES.VIDEO]: v,
        [CONTENT_TYPES.PDF]: p,
        all: v == null || p == null ? null : v + p,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [filtersReady, grade, section, freeOnly]); 
  // Subjects for the current level + section + type.
  useEffect(() => {
    if (!filtersReady) return;
    let cancelled = false;
    const scope = filterConstraints({ grade, section, subject: "all", type, docCategory: "all", teacherId, free: freeOnly });
    countMany(subjectCandidates.map((s) => [s.id, [...scope, where("subjectId", "==", s.id)]])).then(
      (m) => !cancelled && setSubjectCounts(m)
    );
    return () => {
      cancelled = true;
    };
  }, [filtersReady, grade, section, type, subjectCandidates, freeOnly]);

  // PDF types (Cours, Série…) on the PDF tab, for the current level + section + subject.
  useEffect(() => {
    if (!filtersReady || type !== CONTENT_TYPES.PDF) {
      setDocCategoryCounts(null);
      return;
    }
    let cancelled = false;
    const scope = filterConstraints({ grade, section, subject, type: CONTENT_TYPES.PDF, docCategory: "all", teacherId, free: freeOnly });
    countMany(PDF_CATEGORIES.map((c) => [c.id, [...scope, where("pdfCategory", "==", c.id)]])).then(
      (m) => !cancelled && setDocCategoryCounts(m)
    );
    return () => {
      cancelled = true;
    };
  }, [filtersReady, grade, section, subject, type, freeOnly]);

  // A PDF type with no documents for the new filters falls back to "all".
  useEffect(() => {
    if (docCategory !== "all" && docCategoryCounts && docCategoryCounts.get(docCategory) === 0) {
      setDocCategory("all");
    }
  }, [docCategory, docCategoryCounts]);

  // Levels in the menu: those with documents (+ the one currently selected).
  const gradeGroups = useMemo(
    () =>
      GRADE_GROUPS.map((group) => ({
        levelName: group.levelName,
        grades: group.grades.filter(
          (g) => g.id === grade || hasDocs(gradeCounts, g.id)
        ),
      })).filter((group) => group.grades.length > 0),
    [gradeCounts, grade]
  ); 
  const docCategoryChips = useMemo(
    () =>
      PDF_CATEGORIES.filter((c) => hasDocs(docCategoryCounts, c.id)).map((c) => ({
        ...c,
        count: docCategoryCounts?.get(c.id) ?? null,
      })),
    [docCategoryCounts]
  );

  const gradesWithContent = gradeCounts ? [...gradeCounts.values()].filter((n) => n > 0).length : null;

  const filters = useMemo(
    () => ({ grade, section, subject, type, docCategory, q: searchQuery, free: freeOnly }),
    [grade, section, subject, type, docCategory, searchQuery, freeOnly]
  );

  // ---- Load the first 40 whenever the filters change ----
  useEffect(() => {
    if (!filtersReady) return;
    writeUrlFilters(filters);

    const requestId = ++requestRef.current;
    lastDocRef.current = null;
    setItems([]);
    setTotal(null);
    setHasMore(false);
    setLoading(true);
    setLoadError(null);

    const where_ = filterConstraints({ ...filters, teacherId });
    const base = collection(DB, "videos");

    // ---- Search: one query, results ranked here, no "Voir plus" ----
    const words = searchWords(filters.q);
    if (words.length) {
      getDocs(query(base, ...where_, where("searchKeywords", "array-contains-any", withVariants(words)), limit(SEARCH_LIMIT)))
        .then((snap) => {
          if (requestRef.current !== requestId) return;
          const ranked = rankResults(
            snap.docs.map((d) => ({ id: d.id, ...d.data() })),
            words
          );
          setItems(ranked);
          setTotal(ranked.length);
        })
        .catch((err) => {
          if (requestRef.current !== requestId) return;
          console.error("Catalog search failed", err);
          setLoadError("La recherche n'a pas pu aboutir. Réessayez.");
        })
        .finally(() => {
          if (requestRef.current === requestId) setLoading(false);
        });
      return;
    }

    getDocs(query(base, ...where_, limit(BATCH_SIZE)))
      .then((snap) => {
        if (requestRef.current !== requestId) return;
        lastDocRef.current = snap.docs[snap.docs.length - 1] || null;
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setHasMore(snap.docs.length === BATCH_SIZE);
      })
      .catch((err) => {
        if (requestRef.current !== requestId) return;
        // A missing index error contains the link that creates it — see the console.
        console.error("Catalog query failed", err);
        setLoadError("Impossible de charger les documents. Réessayez plus tard.");
      })
      .finally(() => {
        if (requestRef.current === requestId) setLoading(false);
      });

    // How many match in total (1 read per 1000 documents) — for "40 sur 120".
    getCountFromServer(query(base, ...where_))
      .then((agg) => requestRef.current === requestId && setTotal(agg.data().count))
      .catch(() => {});
  }, [filtersReady, filters]); 
  // ---- "Voir plus": next 40 after the last loaded document ----
  async function loadMore() {
    if (loadingMore || !hasMore || !lastDocRef.current) return;
    const requestId = requestRef.current;
    setLoadingMore(true);
    try {
      const snap = await getDocs(
        query(
          collection(DB, "videos"),
          ...filterConstraints({ ...filters, teacherId }),
          startAfter(lastDocRef.current),
          limit(BATCH_SIZE)
        )
      );
      if (requestRef.current !== requestId) return;
      lastDocRef.current = snap.docs[snap.docs.length - 1] || lastDocRef.current;
      setItems((prev) => {
        const seen = new Set(prev.map((v) => v.id));
        return [...prev, ...snap.docs.filter((d) => !seen.has(d.id)).map((d) => ({ id: d.id, ...d.data() }))];
      });
      setHasMore(snap.docs.length === BATCH_SIZE);
    } catch (err) {
      console.error("Catalog: load more failed", err);
    } finally {
      setLoadingMore(false);
    }
  }

  // ---- Hero totals: number of videos and PDFs on the platform ----
  useEffect(() => {
    let cancelled = false;
    const base = collection(DB, "videos");
    const published = where("status", "==", "published");
    Promise.all([
      getCountFromServer(query(base, published, ...teacherScope, where("type", "==", CONTENT_TYPES.VIDEO))),
      getCountFromServer(query(base, published, ...teacherScope, where("type", "==", CONTENT_TYPES.PDF))),
    ])
      .then(([v, p]) => !cancelled && setCatalogTotals({ videos: v.data().count, pdfs: p.data().count }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [teacherScope]); 
  const currentGrade = grade !== "all" ? gradeById(grade) : null;
  const currentSubject = subjectChips.find((s) => s.id === subject);
  const currentDocCategory = docCategory !== "all" ? getPdfCategory(docCategory) : null;
  const searching = searchWords(searchQuery).length > 0;
  const activeFilters =
    (searching ? 1 : 0) +
    (section !== "all" ? 1 : 0) +
    (subject !== "all" ? 1 : 0) +
    (type !== "all" ? 1 : 0) +
    (freeOnly ? 1 : 0) +
    (currentDocCategory ? 1 : 0);
  const shownTotal = total ?? items.length;

  // Why a document can't be opened (null = it can). The hidden usage limit is
  // checked by the server just before opening (claimAccess below).
  const lockReason = useCallback(
    (v) => {
      if (isOpenDoc(v)) return null; // open (free) document: everyone, even without an account
      if (!user) return "login";
      if (isFreeAccess(user, v)) return null; // teacher's own document
      if (!subStatus) return null; // still loading → the server decides
      return subStatus.active ? null : subStatus.state;
    },
    [user, subStatus]
  );

  const [opening, setOpening] = useState(null); // id of the document being checked

  async function openItem(v) {
    const reason = lockReason(v);
    if (reason) {
      setLocked({ item: v, reason });
      return;
    }
    if (isStudent && !isFreeAccess(user, v) && !isOpenDoc(v)) {
      // Ask the server first, so a refusal shows the right window (not an error in the player).
      setOpening(v.id);
      const res = await claimAccess(v.id);
      setOpening(null);
      if (!res.ok) {
        setLocked({ item: v, reason: res.code });
        if (res.code !== "quota") refreshSub();
        return;
      }
    }
    if (isPdf(v)) setReading(v);
    else setPlaying(v);
  }

  function closeViewer() {
    setPlaying(null);
    setReading(null);
  }

  function submitSearch(e) {
    e?.preventDefault();
    const q = searchInput.trim().replace(/\s+/g, " ").slice(0, 80);
    setSearchInput(q);
    setSearchQuery(q);
    // Close the phone keyboard so the results are visible.
    if (typeof document !== "undefined") document.activeElement?.blur?.();
  }

  function clearSearch() {
    setSearchInput("");
    setSearchQuery("");
  }

  function searchEverywhere() {
    setGrade("all");
    setSection("all");
    setSubject("all");
    setType("all");
    setDocCategory("all");
    setFreeOnly(false);
  }

  function clearFilters() {
    clearSearch();
    setSection("all");
    setSubject("all");
    setType("all");
    setDocCategory("all");
    setFreeOnly(false);
  }


  // Banner under an open document: visitors and students without an active subscription.
  const showFreeCta = (v) =>
    isOpenDoc(v) && (!user || (isStudent && !isFreeAccess(user, v) && subStatus?.active !== true));

  function jumpToGrade(id) {
    setGrade(id);
    setSubject("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  // =========================================================
  // RENDER
  // =========================================================

  if (!hydrated) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }


  return (
    <div className={embedded ? "cat-embedded" : "home-page"}>
      {/* ---------- Hero (home page only) ---------- */}
      {!embedded && (
      <section className="vid-hero">
        <div className="vid-container">
          <p className="vid-eyebrow">🇹🇳 Du primaire au bac · à ton rythme</p>
          <h1 className="vid-title">
            {isStudent && firstName ? `Salut ${firstName} ! Qu'apprend-on aujourd'hui ?` : "Les cours de ta classe, en vidéo et en PDF"}
          </h1>
          <p className="vid-subtitle">
            {catalogTotals
              ? `${countLabel(catalogTotals.videos, CONTENT_TYPES.VIDEO)} · ${countLabel(
                  catalogTotals.pdfs,
                  CONTENT_TYPES.PDF
                )}${
                  gradesWithContent ? ` · ${gradesWithContent} niveau${gradesWithContent > 1 ? "x" : ""}` : ""
                } · par des enseignants tunisiens`
              : "Vidéos et PDF par des enseignants tunisiens"}
          </p>
        </div>
      </section>
      )}

      {embedded && title && (
        <div className="vid-container">
          <h2 className="cat-embedded-title">{title}</h2>
        </div>
      )}

      {/* ---------- Filter bar (sticky on computers) ---------- */}
      <div className={`vid-filterbar cat-filterbar ${embedded ? "cat-filterbar-embedded" : ""}`}>
        <div className="vid-container vid-filterbar-inner">
          {/* Search: runs only on Enter / "Rechercher" (one query), never while typing */}
          <form className="cat-search" role="search" onSubmit={submitSearch}>
            <span className="cat-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              maxLength={80}
              placeholder={embedded ? "Leçon ou matière…" : "Leçon, matière ou enseignant…"}
              aria-label="Chercher une leçon, une matière ou un enseignant"
              className="cat-search-input"
            />
            {searchInput && (
              <button type="button" className="cat-search-clear" onClick={clearSearch} aria-label="Effacer la recherche">
                ✕
              </button>
            )}
            <button type="submit" className="cat-search-btn" aria-label="Rechercher">
              <span className="cat-search-btn-label">Rechercher</span>
              <span className="cat-search-btn-icon" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          <div className="cat-filter-row">
            <select
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                setSubject("all");
              }}
              aria-label="Niveau"
              className="vid-select cat-select cat-select-grade"
            >
              <option value="all">🎒 Tous les niveaux</option>
              {gradeGroups.map((group) => (
                <optgroup key={group.levelName} label={group.levelName}>
                  {group.grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {gradeEmoji(g.id)} {g.name}
                      {gradeCounts?.get(g.id) != null ? ` (${gradeCounts.get(g.id)})` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-label="Matière"
              className={`vid-select cat-select ${subject !== "all" ? "cat-select-active" : ""}`}
            >
              <option value="all">✨ Toutes les matières</option>
              {subjectChips.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name}
                  {s.count != null ? ` (${s.count})` : ""}
                </option>
              ))}
            </select>

            <div className="vid-type-toggle cat-type-toggle" role="radiogroup" aria-label="Type de document">
              {TYPE_FILTERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={type === t.id}
                  onClick={() => setType(t.id)}
                  className={`vid-type-option ${type === t.id ? "vid-type-option-active" : ""}`}
                >
                  {t.label}
                  {typeCounts?.[t.id] != null && <span className="vid-type-count">{typeCounts[t.id]}</span>}
                </button>
              ))}
            </div>

            {/* All documents ↔ free ones only: two clear buttons, one always selected. */}
            <div className="cat-access" role="radiogroup" aria-label="Accès aux documents">
              {[
                { id: false, label: "Tous les documents" },
                { id: true, label: "Gratuits" },
              ].map((a) => (
                <button
                  key={String(a.id)}
                  type="button"
                  role="radio"
                  aria-checked={freeOnly === a.id}
                  onClick={() => setFreeOnly(a.id)}
                  className={`cat-access-option ${freeOnly === a.id ? "cat-access-option-active" : ""}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {hasSections && SPECIALIZATIONS.some((sp) => hasDocs(sectionCounts, sp.id)) && (
            <ChipRow label="Filtrer par section">
              <span className="vid-chip-label">Section :</span>
              <Chip small active={section === "all"} onClick={() => setSection("all")}>
                Toutes
              </Chip>
              {SPECIALIZATIONS.filter((sp) => hasDocs(sectionCounts, sp.id)).map((s) => (
                <Chip small key={s.id} active={section === s.id} onClick={() => setSection(s.id)}>
                  {s.name}
                  {sectionCounts?.get(s.id) != null && <span className="vid-chip-count">{sectionCounts.get(s.id)}</span>}
                </Chip>
              ))}
            </ChipRow>
          )}

          {type === CONTENT_TYPES.PDF && docCategoryChips.length > 1 && (
            <ChipRow label="Filtrer par type de PDF">
              <span className="vid-chip-label">Type :</span>
              <Chip small active={docCategory === "all"} onClick={() => setDocCategory("all")}>
                Tous
              </Chip>
              {docCategoryChips.map((c) => (
                <Chip small key={c.id} active={docCategory === c.id} onClick={() => setDocCategory(c.id)}>
                  {c.emoji} {c.label}
                  {c.count != null && <span className="vid-chip-count">{c.count}</span>}
                </Chip>
              ))}
            </ChipRow>
          )}

        </div>
      </div> 
      {/* ---------- Results ---------- */}
      <div className="vid-container vid-body">
        {/* Visitors: one short line, so the first cards stay on the first screen */}
        {!user && (
          <div className="vid-login-strip">
            <span>👋 Essaie les documents gratuits, ou connecte-toi pour tout ouvrir.</span>
            <Link href="/login" className="vid-login-strip-btn">
              Connexion
            </Link>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : loadError ? (
          <p className="vid-error">{loadError}</p>
        ) : catalogTotals && catalogTotals.videos + catalogTotals.pdfs === 0 ? (
          embedded ? (
            <EmptyState emoji="📚" title="Aucun document pour l'instant">
              Cet enseignant n'a pas encore publié de vidéo ni de PDF.
            </EmptyState>
          ) : (
            <EmptyState emoji="📚" title="Les premiers cours arrivent très bientôt">
              Nos enseignants préparent leurs vidéos et leurs PDF. Revenez dans quelques jours !
            </EmptyState>
          )
        ) : (
          <>
            <div className="vid-results-head">
              <h2 className="vid-results-title">
                {searching ? (
                  <>
                    🔎 « {searchQuery} »
                    {(currentGrade || currentSubject) && (
                      <span className="cat-results-scope">
                        {" "}
                        dans {[currentGrade?.name, currentSubject?.name].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {currentGrade ? `${gradeEmoji(currentGrade.id)} ${currentGrade.name}` : "Tous les niveaux"}
                    {currentSubject && <span className="vid-results-accent"> · {currentSubject.name}</span>}
                    {freeOnly && <span className="vid-results-accent"> · Gratuits</span>}
                  </>
                )}
              </h2>
              <div className="vid-results-meta">
                <span>
                  {searching ? `${shownTotal} résultat${shownTotal > 1 ? "s" : ""}` : countLabel(shownTotal, type)}
                </span>
                {activeFilters > 0 && (
                  <button type="button" onClick={clearFilters} className="vid-link-btn">
                    Effacer les filtres
                  </button>
                )}
              </div>
            </div> 
            {items.length === 0 ? (
              searching ? (
                <EmptyState emoji="🔎" title={`Aucun résultat pour « ${searchQuery} »`}>
                  Essaie un autre mot : le nom de la leçon, la matière ou l'enseignant.
                  <br />
                  {(grade !== "all" || subject !== "all" || type !== "all" || section !== "all") && (
                    <button type="button" onClick={searchEverywhere} className="vid-btn-secondary">
                      Chercher dans tous les niveaux
                    </button>
                  )}{" "}
                  <button type="button" onClick={clearSearch} className="vid-btn-secondary">
                    Effacer la recherche
                  </button>
                </EmptyState>
              ) : activeFilters > 0 ? (
                <EmptyState
                  emoji="🔎"
                  title={
                    type === CONTENT_TYPES.PDF
                      ? "Aucun PDF ne correspond à ces filtres."
                      : type === CONTENT_TYPES.VIDEO
                      ? "Aucune vidéo ne correspond à ces filtres."
                      : "Aucun document ne correspond à ces filtres."
                  }
                >
                  <button type="button" onClick={clearFilters} className="vid-btn-secondary">
                    Effacer les filtres
                  </button>
                </EmptyState>
              ) : (
                <EmptyState emoji="📚" title="Pas encore de documents pour ce niveau">
                  Ils arrivent très bientôt !
                  <br />
                  <button type="button" onClick={() => jumpToGrade("all")} className="vid-btn-secondary">
                    Voir tous les niveaux
                  </button>
                </EmptyState>
              )
            ) : (
              <>
                <div className="vid-grid">
                  {items.map((v) => (
                    <ContentCard
                      key={v.id}
                      item={v}
                      locked={!!lockReason(v)}
                      isLoggedIn={!!user}
                      showGrade={grade === "all"}
                      showSection={hasSections && section === "all"}
                      onClick={() => opening !== v.id && openItem(v)}
                    />
                  ))}
                </div> 
                {(hasMore || (total != null && items.length < total)) && (
                  <div className="vid-more">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore || !hasMore}
                      className="vid-btn-secondary"
                    >
                      {loadingMore ? "Chargement..." : "Voir plus"}
                    </button>
                    {total != null && (
                      <p className="vid-more-count">
                        {items.length} sur {total}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

          </>
        )} 
        {/* Short teacher call-to-action (home page only) */}
        {!isStudent && !embedded && (
          <section className="vid-teacher-cta">
            <span className="vid-teacher-cta-emoji">🏫</span>
            <div className="vid-teacher-cta-text">
              <p className="vid-teacher-cta-title">Vous êtes enseignant ?</p>
              <p className="vid-teacher-cta-sub">Publiez vos vidéos et vos PDF, et gagnez de l'argent à chaque vue.</p>
            </div>
            <a href={TEACHER_JOIN_LINK} target="_blank" rel="noopener noreferrer" className="vid-teacher-cta-btn">
              💬 Nous contacter
            </a>
          </section>
        )}
      </div>

      {/* On a teacher's profile, his name in the player is not a link (we are already there). */}
      {playing && (
        <PlayerModal
          video={playing}
          onClose={closeViewer}
          linkTeacher={!embedded}
          freeCta={showFreeCta(playing)}
          isLoggedIn={!!user}
        />
      )}
      {reading && (
        <PdfReaderModal
          pdf={reading}
          onClose={closeViewer}
          linkTeacher={!embedded}
          freeCta={showFreeCta(reading)}
          isLoggedIn={!!user}
        />
      )}

      {locked && <AccessModal item={locked.item} reason={locked.reason} onClose={() => setLocked(null)} />}
    </div>
  );
} 
// =========================================================
// SMALL UI PIECES
// (card, player, PDF reader and locked window: app/components/DocumentCards.js)
// =========================================================

function EmptyState({ emoji, title, children }) {
  return (
    <div className="vid-empty">
      <p className="vid-empty-emoji">{emoji}</p>
      <p className="vid-empty-title">{title}</p>
      {children && <div className="vid-empty-text">{children}</div>}
    </div>
  );
} 
// Horizontal chip row. Phones: swipe. Computers (no horizontal swipe with a
// mouse): ‹ › arrows appear when chips overflow, and the mouse wheel scrolls
// the row sideways while the pointer is over it.
function ChipRow({ label, children }) {
  const rowRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ left: el.scrollLeft > 2, right: el.scrollLeft < max - 2 });
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    el.addEventListener("scroll", update, { passive: true });

    // Vertical wheel → horizontal scroll (only while the row can still move that way).
    function onWheel(e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + e.deltaY;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max)) return;
      e.preventDefault();
      el.scrollLeft = Math.max(0, Math.min(max, next));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
      el.removeEventListener("wheel", onWheel);
    };
  }, [update, children]);

  function scrollBy(dir) {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.7), behavior: "smooth" });
  }
 
  return (
    <div className={`vid-chip-scroller ${edges.left ? "vid-chip-scroller-left" : ""} ${edges.right ? "vid-chip-scroller-right" : ""}`}>
      {edges.left && (
        <button type="button" className="vid-chip-arrow vid-chip-arrow-left" onClick={() => scrollBy(-1)} aria-label="Défiler à gauche">
          ‹
        </button>
      )}
      <div ref={rowRef} className="vid-chip-row" aria-label={label}>
        {children}
      </div>
      {edges.right && (
        <button type="button" className="vid-chip-arrow vid-chip-arrow-right" onClick={() => scrollBy(1)} aria-label="Défiler à droite">
          ›
        </button>
      )}
    </div>
  );
}

function Chip({ active, onClick, children, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`vid-chip ${small ? "vid-chip-sm" : ""} ${active ? "vid-chip-active" : ""}`}
    >
      {children}
    </button>
  );
}
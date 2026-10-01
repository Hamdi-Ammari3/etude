import { adminDb, requireUser, jsonError, FieldValue } from "../../../../../lib/videoServer";
import { canWatchVideo } from "../../../../../lib/videoAccess";
import {
  CONTENT_TYPES,
  TEACHER_FIELDS,
  VIEW_RATE_MILLIMES,
  PDF_VIEW_RATE_MILLIMES,
  PDF_PAGE_RATIO,
  PDF_PAGE_DWELL_MS,
  PDF_MIN_READ_SEC,
  PDF_HEARTBEAT_MS,
} from "../../../../../lib/videoConfig";
import { mergeChunks, countBits, monthKeyTunis } from "../../../../../lib/viewMath";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PAGES = 2000;
const MAX_CREDIT_PER_BEAT_SEC = 120;
const MAX_ELAPSED_SEC = 600;

/**
 * POST /api/pdfs/{id}/progress
 * Body: { pages: number[] (1-based, newly seen), activeSec: number, totalPages: number, currentPage: number }
 *
 * The viewer reports which pages were really on screen (≥ 2 s each) and how
 * long the student read. The first time a student has seen HALF of the pages
 * AND read for 30 s, ONE read is counted (transaction → never twice) and the
 * teacher earns the PDF rate (0,05 DT, frozen on the document at publish time).
 *
 * The server only trusts what real time allows: new pages are capped by the
 * time since the last report (1 page per 2 s), and reading time can't exceed
 * the time that actually passed.
 *
 * Writes (Admin SDK only):
 *   videoViews/{pdfId}_{uid}               pages seen, reading time, counted flag
 *   videos/{pdfId}                         views +1, monthlyViews["YYYY-MM"] +1
 *   users/{teacherId}                      balance, total views, total earned
 *   teacherEarnings/{teacherId}_{YYYY-MM}  views +1, pdfViews +1, amountMillimes +rate
 */
export async function POST(request, { params }) {
  let user;
  try {
    user = await requireUser(request);
  } catch (res) {
    return res instanceof Response ? res : jsonError("Erreur d'authentification.", 401);
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) return jsonError("Document introuvable.", 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Requête invalide.");
  }

  const db = adminDb();
  const pdfRef = db.collection("videos").doc(id);
  const [pdfSnap, userSnap] = await Promise.all([pdfRef.get(), db.collection("users").doc(user.uid).get()]);
  if (!pdfSnap.exists) return jsonError("Document introuvable.", 404);
  const pdf = pdfSnap.data();
  if (pdf.type !== CONTENT_TYPES.PDF) return jsonError("Ce contenu n'est pas un PDF.", 400);

  const profile = userSnap.exists ? userSnap.data() : {};
  const role = user.role || profile.role || null;
  if (!canWatchVideo({ ...profile, uid: user.uid, role }, pdf)) return jsonError("Accès refusé.", 403);

  // Only real students on published PDFs generate paid reads.
  const countable =
    pdf.status === "published" && pdf.teacherId !== user.uid && role !== "teacher" && role !== "admin";
  if (!countable) return Response.json({ tracking: false, counted: false });

  // Page count measured by the server at upload; the viewer's count is only a fallback.
  const reportedTotal = Math.round(Number(body.totalPages) || 0);
  const total = pdf.pageCount || (reportedTotal > 0 ? Math.min(reportedTotal, MAX_PAGES) : 0);
  if (!total) return Response.json({ tracking: false, counted: false });

  const required = Math.max(1, Math.ceil(total * PDF_PAGE_RATIO));
  const reportedPages = (Array.isArray(body.pages) ? body.pages : []).map((p) => Number(p) - 1); // → 0-based
  const activeSec = Math.max(0, Number(body.activeSec) || 0);
  const currentPage = Math.min(total, Math.max(1, Math.round(Number(body.currentPage) || 1)));
  const rate = Math.min(VIEW_RATE_MILLIMES, Number(pdf.viewRateMillimes) || PDF_VIEW_RATE_MILLIMES);

  const viewRef = db.collection("videoViews").doc(`${id}_${user.uid}`);
  const now = Date.now();

  try {
    const result = await db.runTransaction(async (tx) => {
      const viewSnap = await tx.get(viewRef);
      const view = viewSnap.exists ? viewSnap.data() : null;

      const base = {
        videoId: id,
        contentType: CONTENT_TYPES.PDF,
        studentId: user.uid,
        teacherId: pdf.teacherId,
        gradeId: pdf.gradeId || null,
        totalPages: total,
        lastPage: currentPage,
        lastHeartbeatAt: FieldValue.serverTimestamp(),
      };

      if (view?.counted) {
        tx.set(viewRef, base, { merge: true });
        return { counted: true, justCounted: false, seen: view.pagesSeenCount || required, readSec: view.readSec || 0, accepted: [] };
      }

      // Time that really passed since the last report (first report: one heartbeat window).
      const lastMs = view?.lastHeartbeatAt?.toMillis?.() || 0;
      const elapsedSec = lastMs
        ? Math.min(MAX_ELAPSED_SEC, Math.max(0, (now - lastMs) / 1000))
        : PDF_HEARTBEAT_MS / 1000;

      const creditSec = Math.min(activeSec, elapsedSec + 5, MAX_CREDIT_PER_BEAT_SEC);
      const pageAllowance = Math.floor(elapsedSec / (PDF_PAGE_DWELL_MS / 1000)) + 2;

      const storedBits = view?.totalPages === total ? view.pageBits : null;
      const { bits, accepted } = mergeChunks(storedBits, reportedPages, total, pageAllowance);
      const seen = countBits(bits);
      const readSec = Math.round(((view?.readSec || 0) + creditSec) * 10) / 10;

      const update = {
        ...base,
        pageBits: bits,
        pagesSeenCount: seen,
        readSec,
        counted: false,
        ...(viewSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      };

      if (seen >= required && readSec >= PDF_MIN_READ_SEC) {
        const monthKey = monthKeyTunis(new Date(now));
        update.counted = true;
        update.countedAt = FieldValue.serverTimestamp();
        update.monthKey = monthKey;
        update.rateMillimes = rate;

        tx.update(pdfRef, {
          views: FieldValue.increment(1),
          [`monthlyViews.${monthKey}`]: FieldValue.increment(1),
        });

        tx.set(
          db.collection("users").doc(pdf.teacherId),
          {
            [TEACHER_FIELDS.BALANCE]: FieldValue.increment(rate),
            [TEACHER_FIELDS.VIEWS_TOTAL]: FieldValue.increment(1),
            [TEACHER_FIELDS.EARNED_TOTAL]: FieldValue.increment(rate),
          },
          { merge: true }
        );

        tx.set(
          db.collection("teacherEarnings").doc(`${pdf.teacherId}_${monthKey}`),
          {
            teacherId: pdf.teacherId,
            monthKey,
            views: FieldValue.increment(1),
            pdfViews: FieldValue.increment(1),
            amountMillimes: FieldValue.increment(rate),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      tx.set(viewRef, update, { merge: true });
      return { counted: update.counted, justCounted: update.counted, seen, readSec, accepted };
    });

    return Response.json({
      tracking: true,
      counted: result.counted,
      justCounted: result.justCounted,
      pagesSeen: result.seen,
      pagesRequired: required,
      readSec: result.readSec,
      // 1-based pages actually recorded — the viewer re-sends the others next time.
      accepted: result.accepted.map((p) => p + 1),
    });
  } catch (err) {
    console.error("pdf progress failed", id, user.uid, err);
    return jsonError("Erreur temporaire.", 500);
  }
}
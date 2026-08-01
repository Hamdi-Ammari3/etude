// lib/trimestres.js
// Central place for trimestre labels/periods/images so the subject page
// (trimestre picker) and the trimestre lessons page stay in sync.

export const TRIMESTRE_META = {
  1: {
    id: "1",
    label: "Trimestre 1",
    period: "Septembre — Décembre",
    tag: "En cours",
    tagTone: "primary",
    emoji: "🍂",
    image: "/trimestre-1.jpg",
  },
  2: {
    id: "2",
    label: "Trimestre 2",
    period: "Janvier — Mars",
    tag: "À venir",
    tagTone: "muted",
    emoji: "❄️",
    image: "/trimestre-2.jpg",
  },
  3: {
    id: "3",
    label: "Trimestre 3",
    period: "Avril — Juin",
    tag: "À venir",
    tagTone: "muted",
    emoji: "🎓",
    image: "/trimestre-3.jpg",
  },
};

// Buckets `lessons` (the array returned by findLessonsForSubject) into up
// to 3 groups, one per trimestre, skipping any trimestre with no lessons.
// Used by the subject page to build the 3 picker cards + their counts.
export function trimestreGroups(lessons) {
  return [1, 2, 3]
    .map((t) => ({
      ...TRIMESTRE_META[t],
      trimestre: t,
      lessons: lessons.filter((l) => l.trimestre === t),
    }))
    .filter((g) => g.lessons.length > 0);
}

// Resolves a single trimestre (by its route param, "1"/"2"/"3") to its
// metadata + sorted lessons + a numbering offset so lesson numbers keep
// counting up across trimestres (e.g. Trimestre 2 starts at 09, not 01).
// Returns null if the trimestre id is invalid or has no lessons.
export function findTrimestre(lessons, trimestreId) {
  const t = Number(trimestreId);
  const meta = TRIMESTRE_META[t];
  if (!meta) return null;

  const tLessons = lessons.filter((l) => l.trimestre === t).sort((a, b) => a.order - b.order);
  if (tLessons.length === 0) return null;

  const offset = lessons.filter((l) => l.trimestre < t).length;

  return { ...meta, trimestre: t, lessons: tLessons, offset };
}
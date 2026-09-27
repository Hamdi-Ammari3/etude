// Which grades a user can watch videos for. Shared by the videos page
// (to show 🔒 or ▶) and the play API route (the real enforcement).
//
// ⚠️ The grade IDs stored on the user MUST use the same format as the
// `gradeId` teachers pick in the publish modal (lib/liveGrades.js ALL_GRADES).
// If your student accounts store grades differently (e.g. "col-7" vs "7eme"),
// map them here.

export function getAccessibleGradeIds(user) {
  const ids = new Set();
  if (!user) return ids;

  if (Array.isArray(user.purchasedGrades)) {
    user.purchasedGrades.forEach((g) => g && ids.add(String(g)));
  }
  // Optional single-grade field, if your profiles have one.
  if (user.gradeId) ids.add(String(user.gradeId));

  return ids;
}

export function canWatchVideo(user, video) {
  if (!user || !video) return false;
  if (video.teacherId && video.teacherId === user.uid) return true; // teacher previewing own video
  if (user.role === "admin") return true;
  if (video.status !== "published") return false;
  return getAccessibleGradeIds(user).has(String(video.gradeId));
}
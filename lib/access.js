export function isGradeUnlocked(user, gradeId) {
  return !!user?.purchasedGrades?.includes(gradeId);
}

// lessonIndex = the lesson's position within its subject's lessons array (0-based)
export function canAccessLesson(user, gradeId, lessonIndex) {
  if (isGradeUnlocked(user, gradeId)) return true;
  return lessonIndex === 0; // first lesson of each subject is always a free preview
}
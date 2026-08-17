// lib/recurrence.js
//
// Shared weekly-recurrence expansion logic — plain Date math only (no
// browser-only or Node-only APIs), so it's safe to import from BOTH
// client components (teacher dashboard calendar, student course
// listing) AND server-side API routes (the join-course transaction).
//
// This is deliberately centralized rather than duplicated: the join
// route is the source of truth for which session dates a student
// actually gets booked and charged for, and it must compute occurrences
// identically to what the student saw on screen before clicking
// "Rejoindre" — any drift between client and server logic here would
// mean a student getting booked for a different date than they were
// shown.

export function getNextOccurrence(weeklySlots, from = new Date()) {
  if (!weeklySlots || weeklySlots.length === 0) return null;
  for (let offset = 0; offset < 8; offset++) {
    const d = new Date(from);
    d.setDate(d.getDate() + offset);
    const idx = (d.getDay() + 6) % 7; // Monday = 0
    for (const slot of weeklySlots) {
      if (slot.day !== idx || !slot.time) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const candidate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m || 0);
      if (candidate > from) return candidate;
    }
  }
  return null;
}

export function getUpcomingOccurrences(weeklySlots, count = 4, from = new Date()) {
  if (!weeklySlots || weeklySlots.length === 0) return [];
  const out = [];
  for (let offset = 0; out.length < count && offset < 60; offset++) {
    const d = new Date(from);
    d.setDate(d.getDate() + offset);
    const idx = (d.getDay() + 6) % 7;
    for (const slot of weeklySlots) {
      if (slot.day !== idx || !slot.time) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const candidate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m || 0);
      if (candidate > from) out.push(candidate);
    }
  }
  return out.slice(0, count);
}

export function expandSlotsForMonth(weeklySlots, year, month, notBefore) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const out = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const idx = (date.getDay() + 6) % 7;
    for (const slot of weeklySlots || []) {
      if (slot.day !== idx || !slot.time) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const occurrence = new Date(year, month, day, h, m || 0);
      if (notBefore && occurrence < notBefore) continue;
      out.push({
        dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        dateTime: occurrence,
      });
    }
  }
  return out;
}
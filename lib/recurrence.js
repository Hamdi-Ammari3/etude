/*
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
*/

// lib/recurrence.js
//
// Shared weekly-recurrence expansion logic — used both client-side
// (course listing preview) and server-side (the join/prolong
// transactions, which are the actual source of truth for what date a
// student gets booked and charged for).
//
// CRITICAL: never use `new Date(year, month, day, h, m)` to turn a
// weeklySlot into an actual instant, and never read a Date's calendar
// fields back via `.getDay()/.getDate()/.getMonth()` for comparison
// against a slot's `day`. Both of those interpret/report in whatever
// timezone the MACHINE RUNNING THE CODE happens to be set to — which
// differs between the server (commonly UTC on most hosts) and every
// client browser (whatever that PC's OS is configured to). That's
// exactly what caused the same course slot to resolve to a different
// actual moment in time depending on where the code ran. Tunisia is
// fixed at UTC+1 year-round (no DST since 2005), so every conversion
// here is done explicitly against that fixed offset instead of
// relying on ambient local time.

const TUNISIA_UTC_OFFSET_HOURS = 1;

// The exact UTC instant for "this calendar date, at this Tunisia-local
// time" — independent of the calling machine's own timezone setting.
export function buildTunisiaDateTime(year, month, day, hour, minute) {
  return new Date(Date.UTC(year, month, day, hour - TUNISIA_UTC_OFFSET_HOURS, minute));
}

// Reads Tunisia-local calendar fields (year/month/date/weekday) off any
// Date instant, regardless of the machine's own timezone — by shifting
// to Tunisia time first, then reading back via the UTC getters (which
// are themselves timezone-independent). Exported because ANY code
// comparing "which Tunisia calendar day is this instant on" needs this,
// not just the recurrence functions below — e.g. a "is this session
// today / already past" check on an already-correct sessionTime still
// needs this to safely read its calendar day back out.
export function getTunisiaFields(instant) {
  const shifted = new Date(instant.getTime() + TUNISIA_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    date: shifted.getUTCDate(),
    weekday: (shifted.getUTCDay() + 6) % 7, // Monday = 0
  };
}

export function getNextOccurrence(weeklySlots, from = new Date()) {
  if (!weeklySlots || weeklySlots.length === 0) return null;
  // Stepping by exactly 24h is safe specifically because Tunisia has no
  // DST — every calendar day is genuinely 24 hours, so this always
  // lands on the correct next Tunisia-calendar day.
  for (let offset = 0; offset < 8; offset++) {
    const probe = new Date(from.getTime() + offset * 24 * 60 * 60 * 1000);
    const { year, month, date: day, weekday } = getTunisiaFields(probe);
    for (const slot of weeklySlots) {
      if (slot.day !== weekday || !slot.time) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const candidate = buildTunisiaDateTime(year, month, day, h, m || 0);
      if (candidate > from) return candidate;
    }
  }
  return null;
}

export function getUpcomingOccurrences(weeklySlots, count = 4, from = new Date()) {
  if (!weeklySlots || weeklySlots.length === 0) return [];
  const out = [];
  for (let offset = 0; out.length < count && offset < 60; offset++) {
    const probe = new Date(from.getTime() + offset * 24 * 60 * 60 * 1000);
    const { year, month, date: day, weekday } = getTunisiaFields(probe);
    for (const slot of weeklySlots) {
      if (slot.day !== weekday || !slot.time) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const candidate = buildTunisiaDateTime(year, month, day, h, m || 0);
      if (candidate > from) out.push(candidate);
    }
  }
  // Sorted explicitly rather than trusting insertion order — a course
  // with multiple weekly slots landing on the same day (however
  // unlikely) could otherwise come out of chronological order.
  return out.sort((a, b) => a - b).slice(0, count);
}

export function expandSlotsForMonth(weeklySlots, year, month, notBefore) {
  // Days in this month, computed via a UTC construction so "day 0 of
  // next month" reliably yields the correct last day regardless of the
  // machine's timezone.
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const out = [];
  for (let day = 1; day <= daysInMonth; day++) {
    // UTC noon for this calendar day avoids any midnight-boundary edge
    // case when reading the weekday back.
    const { weekday } = getTunisiaFields(new Date(Date.UTC(year, month, day, 12, 0)));
    for (const slot of weeklySlots || []) {
      if (slot.day !== weekday || !slot.time) continue;
      const [h, m] = slot.time.split(":").map(Number);
      const occurrence = buildTunisiaDateTime(year, month, day, h, m || 0);
      if (notBefore && occurrence < notBefore) continue;
      out.push({
        dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        dateTime: occurrence,
      });
    }
  }
  return out;
}
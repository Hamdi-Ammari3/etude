"use client";

import { useState, useEffect } from "react";
import "./Monthcalendarclickable.css";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

// Never round-trip a date-only value through .toISOString() — that method
// always converts to UTC first, and a "midnight local" Date in any
// positive UTC-offset timezone (like Tunisia's UTC+1) rolls back to the
// previous day once converted. Building the key from local components
// directly avoids that entirely.
function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// events: [{ date: "YYYY-MM-DD", title: "..." }]
// onMonthChange(year, month): fires whenever the displayed month changes
// (including on mount) — lets the parent recompute events for that
// specific month rather than only ever knowing about "now".
// onDayClick(dateKey): optional — when provided, days that have at least
// one event become clickable and call this with their "YYYY-MM-DD" key.
// Days with no events are never clickable, and if this prop isn't
// passed at all, no page's calendar behavior changes (backward
// compatible with the homepage and teacher dashboard, which don't use
// this).
// selectedDateKey: optional — the "YYYY-MM-DD" key of the currently
// selected day (if any), rendered with a distinct active style so it's
// clear which day's details are being shown.
export default function MonthCalendar({ events = [], emptyMessage, onMonthChange, onDayClick, selectedDateKey }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  useEffect(() => {
    onMonthChange?.(cursor.getFullYear(), cursor.getMonth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  const eventsByDate = new Map();
  for (const ev of events) {
    const key = ev.date;
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key).push(ev);
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // Monday-first offset (getDay(): 0=Sun..6=Sat -> shift so Monday=0)
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function goPrevMonth() {
    setCursor(new Date(year, month - 1, 1));
  }
  function goNextMonth() {
    setCursor(new Date(year, month + 1, 1));
  }

  return (
    <div className="month-calendar">
      <div className="month-calendar-header">
        <span className="month-calendar-title">
          {MONTH_NAMES[month]} {year}
        </span>
        <div className="month-calendar-nav">
          <button type="button" className="month-calendar-nav-btn" onClick={goPrevMonth} aria-label="Mois précédent">
            ‹
          </button>
          <button type="button" className="month-calendar-nav-btn" onClick={goNextMonth} aria-label="Mois suivant">
            ›
          </button>
        </div>
      </div>

      <div className="month-calendar-grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="month-calendar-weekday">
            {w}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="month-calendar-day month-calendar-day-empty" />;
          }
          const key = toDateKey(date);
          const dayEvents = eventsByDate.get(key) || [];
          const isToday = isSameDay(date, today);
          const hasEvent = dayEvents.length > 0;
          // Two different data sources can both produce an entry for the
          // same course on the same day (pattern preview + real
          // booking) — dedupe by title so that doesn't count as two
          // separate courses needing two labels.
          const uniqueTitles = [...new Set(dayEvents.map((e) => e.title))];
          // Titles are "Subject · Grade" — show just the subject part so
          // each label actually fits; full detail (all titles) stays in
          // the tooltip.
          const visibleLabels = uniqueTitles.slice(0, 2).map((t) => t.split(" · ")[0]);
          const extraCount = uniqueTitles.length - visibleLabels.length;

          const isClickable = hasEvent && Boolean(onDayClick);
          const isSelected = key === selectedDateKey;

          return (
            <div
              key={key}
              className={`month-calendar-day ${hasEvent ? "month-calendar-day-event" : ""} ${isToday ? "month-calendar-day-today" : ""} ${isClickable ? "month-calendar-day-clickable" : ""} ${isSelected ? "month-calendar-day-selected" : ""}`}
              title={dayEvents.map((e) => e.title).join(", ")}
              onClick={isClickable ? () => onDayClick(key) : undefined}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") onDayClick(key);
                    }
                  : undefined
              }
            >
              <span className="month-calendar-day-number-row">
                <span className="month-calendar-day-number">{date.getDate()}</span>
                {isToday && <span className="month-calendar-day-today-dot" aria-hidden="true" />}
              </span>
              {hasEvent && (
                <div className="month-calendar-day-labels">
                  {visibleLabels.map((label, idx) => (
                    <span key={idx} className="month-calendar-day-label">
                      {label}
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="month-calendar-day-label month-calendar-day-label-more">
                      +{extraCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="month-calendar-empty-state">
          <p>{emptyMessage || "Vous n'avez pas encore de séance en direct programmée ce mois-ci."}</p>
          {!emptyMessage && <a href="/direct">Découvrir les cours en direct →</a>}
        </div>
      )}
    </div>
  );
}
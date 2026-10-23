"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ExperienceCard } from "./team-sections";
import type { TeamExperience } from "@/lib/team";

/** How long scroll events are treated as caused by the slider rather than the user. */
const PROGRAMMATIC_SCROLL_MS = 900;

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/**
 * When a position started, as a fractional year, e.g. "August 2026 – present" → 2026.58.
 * "July – August 2025" uses the first month with the first year that appears.
 */
function startDate(entry: TeamExperience): number | null {
  const year = entry.period.match(/\b(?:19|20)\d{2}\b/)?.[0];
  if (!year) return null;
  const firstWord = entry.period.trim().split(/[\s–-]+/)[0].toLowerCase();
  const month = Math.max(MONTHS.indexOf(firstWord), 0);
  return Number(year) + month / 12;
}

/**
 * Work experience shown one position at a time, chosen on a time axis: a tick for every year
 * (most recent on the left) and a dot for each position at its start date. Dragging, clicking or
 * using the arrow keys on the handle moves between positions; swiping the card does the same.
 */
export function WorkTimeline({ entries }: { entries: TeamExperience[] }) {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const programmaticUntil = useRef(0);
  const [active, setActive] = useState(0);
  /** Handle position (0–1) while it is being dragged. */
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  // Axis runs from the year after the latest start (left) to the earliest start year (right).
  const dates = entries.map(startDate);
  const known = dates.filter((date): date is number => date !== null);
  const axisStart = known.length ? Math.floor(Math.max(...known)) + 1 : 1;
  const axisEnd = known.length ? Math.floor(Math.min(...known)) : 0;
  const span = Math.max(axisStart - axisEnd, 1);

  // Positions on the axis (0 = left). Positions sharing a start date are spread slightly apart
  // so each keeps its own dot.
  const positions = dates.map((date, index) => {
    const base = date === null ? index / Math.max(entries.length - 1, 1) : (axisStart - date) / span;
    const sameBefore = dates.slice(0, index).filter((other) => other === date).length;
    return Math.min(base + sameBefore * 0.008, 1);
  });
  const years = Array.from({ length: axisStart - axisEnd + 1 }, (_, i) => axisStart - i);
  const activeYear = dates[active] !== null ? Math.floor(dates[active]!) : null;
  const handlePosition = dragPosition ?? positions[active] ?? 0;

  const onScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || Date.now() < programmaticUntil.current) return;
    setActive(Math.min(Math.max(Math.round(scroller.scrollLeft / scroller.clientWidth), 0), entries.length - 1));
  }, [entries.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller?.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  function select(index: number) {
    const clamped = Math.min(Math.max(index, 0), entries.length - 1);
    setActive(clamped);
    const scroller = scrollerRef.current;
    if (!scroller) return;
    programmaticUntil.current = Date.now() + PROGRAMMATIC_SCROLL_MS;
    scroller.scrollTo({ left: clamped * scroller.clientWidth, behavior: "smooth" });
  }

  function nearestEntry(position: number) {
    let best = 0;
    positions.forEach((candidate, index) => {
      if (Math.abs(candidate - position) < Math.abs(positions[best] - position)) best = index;
    });
    return best;
  }

  function positionFromPointer(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const position = positionFromPointer(event.clientX);
    setDragPosition(position);
    const nearest = nearestEntry(position);
    if (nearest !== active) select(nearest);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPosition === null) return;
    const position = positionFromPointer(event.clientX);
    setDragPosition(position);
    const nearest = nearestEntry(position);
    if (nearest !== active) select(nearest);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPosition === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragPosition(null); // The handle settles on the selected position's dot.
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: entries.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key]);
  }

  const dragging = dragPosition !== null;
  const activeEntry = entries[active];

  return (
    <div>
      {/* Time axis: year ticks, a dot per position at its start date, and a draggable handle */}
      <div className="px-3">
        <div
          ref={trackRef}
          className="relative h-16 cursor-pointer touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span aria-hidden="true" className="absolute left-0 right-0 top-[0.6875rem] h-0.5 bg-ink-100" />
          <span
            aria-hidden="true"
            className={clsx("absolute left-0 top-[0.6875rem] h-0.5 bg-clay-500", !dragging && "transition-[width] duration-300")}
            style={{ width: `${handlePosition * 100}%` }}
          />

          {/* Year ticks and labels */}
          {years.map((year, index) => {
            const left = `${((axisStart - year) / span) * 100}%`;
            const isActive = year === activeYear;
            // Fewer labels on narrow screens: the ends, the active year and every other year.
            const labeled = isActive || index === 0 || index === years.length - 1 || index % 2 === 0;
            return (
              <div key={year} aria-hidden="true">
                <span className="absolute top-[1.125rem] h-1.5 w-px -translate-x-1/2 bg-ink-200" style={{ left }} />
                <span
                  className={clsx(
                    "absolute top-8 -translate-x-1/2 whitespace-nowrap font-display tabular-nums transition-colors",
                    isActive ? "text-sm font-bold text-ink-950" : "text-xs text-ink-400",
                    !labeled && "hidden lg:inline"
                  )}
                  style={{ left }}
                >
                  {year}
                </span>
              </div>
            );
          })}

          {/* One dot per position */}
          {positions.map((position, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={clsx(
                "absolute top-2 h-2 w-2 -translate-x-1/2 rounded-full transition-colors",
                position <= handlePosition ? "bg-clay-500" : "bg-ink-300"
              )}
              style={{ left: `${position * 100}%` }}
            />
          ))}

          {/* Handle */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Work experience position"
            aria-valuemin={1}
            aria-valuemax={entries.length}
            aria-valuenow={active + 1}
            aria-valuetext={`${activeEntry?.period}: ${activeEntry?.position}`}
            onKeyDown={handleKeyDown}
            className={clsx(
              "absolute top-0 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-clay-500 bg-white shadow-md shadow-ink-950/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500",
              dragging ? "scale-110 cursor-grabbing" : "cursor-grab transition-[left,transform] duration-300"
            )}
            style={{ left: `${handlePosition * 100}%` }}
          >
            <span className="h-2 w-2 rounded-full bg-clay-500" />
          </div>
        </div>
      </div>

      {/* One position at a time; swipe sideways to move between them */}
      <ol
        ref={scrollerRef}
        aria-label="Work experience"
        className="no-scrollbar mt-4 flex snap-x snap-mandatory items-start overflow-x-auto"
      >
        {entries.map((entry, index) => (
          <li
            key={`${entry.period}-${entry.position}-${index}`}
            aria-hidden={index !== active}
            className="w-full shrink-0 snap-start"
          >
            <div className="max-w-3xl">
              <ExperienceCard entry={entry} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

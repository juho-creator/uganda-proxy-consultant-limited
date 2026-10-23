"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { ExperienceCard } from "./team-sections";
import type { TeamExperience } from "@/lib/team";

/** Years visible on the axis at once. */
const WINDOW_YEARS = 5;
/** Fraction of the axis at each end where a drag keeps scrolling through the years. */
const EDGE_ZONE = 0.1;
/** How fast the axis scrolls while the handle is held at an edge, in years per second. */
const EDGE_PAN_SPEED = 2;
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
  const firstWord = entry.period
    .trim()
    .split(/[\s–-]+/)[0]
    .toLowerCase();
  const month = Math.max(MONTHS.indexOf(firstWord), 0);
  return Number(year) + month / 12;
}

/**
 * Work experience shown one position at a time, chosen on a time axis that shows five years at
 * once (most recent on the left) with a dot for each position at its start date. The visible
 * window follows the selected position; dragging the handle to either edge keeps scrolling
 * through the years. Clicking a dot, the arrow keys and swiping the card also move between positions.
 */
export function WorkTimeline({ entries }: { entries: TeamExperience[] }) {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const programmaticUntil = useRef(0);

  // Axis runs from the year after the latest start (left) to the earliest start year (right).
  const rawDates = useMemo(() => entries.map(startDate), [entries]);
  const known = rawDates.filter((date): date is number => date !== null);
  const axisStart = known.length ? Math.floor(Math.max(...known)) + 1 : entries.length;
  const axisEnd = known.length ? Math.floor(Math.min(...known)) : 0;
  const span = Math.max(axisStart - axisEnd, 1);
  const visibleYears = Math.min(WINDOW_YEARS, span);

  // Each position's place in time. Positions sharing a start date are nudged apart so each keeps
  // its own dot; positions without a readable date are spread evenly.
  const dates = useMemo(
    () =>
      rawDates.map((date, index) => {
        const base = date ?? axisStart - (index / Math.max(rawDates.length - 1, 1)) * span;
        const sameBefore = rawDates.slice(0, index).filter((other) => other === date).length;
        return base - sameBefore * 0.1;
      }),
    [rawDates, axisStart, span],
  );

  const clampWindow = useCallback(
    (left: number) => Math.min(Math.max(left, axisEnd + visibleYears), axisStart),
    [axisEnd, axisStart, visibleYears],
  );
  const windowFor = useCallback((index: number) => clampWindow(dates[index] + visibleYears / 2), [clampWindow, dates, visibleYears]);

  const [active, setActive] = useState(0);
  /** The date at the left edge of the visible window. */
  const [windowLeft, setWindowLeft] = useState(() => windowFor(0));
  /** Handle position across the visible axis (0–1) while it is being dragged. */
  const [dragPos, setDragPos] = useState<number | null>(null);

  // Refs mirror state for the animation loop.
  const activeRef = useRef(active);
  const windowRef = useRef(windowLeft);
  const dragRef = useRef(dragPos);
  activeRef.current = active;
  windowRef.current = windowLeft;
  dragRef.current = dragPos;

  const scrollCardTo = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    programmaticUntil.current = Date.now() + PROGRAMMATIC_SCROLL_MS;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  }, []);

  /** Selects a position; outside a drag, the window recenters on it. */
  const select = useCallback(
    (index: number, recenter = true) => {
      const clamped = Math.min(Math.max(index, 0), entries.length - 1);
      if (recenter) setWindowLeft(windowFor(clamped));
      if (clamped === activeRef.current) return;
      setActive(clamped);
      scrollCardTo(clamped);
    },
    [entries.length, scrollCardTo, windowFor],
  );

  const nearestTo = useCallback(
    (date: number) =>
      dates.reduce((best, candidate, index) => (Math.abs(candidate - date) < Math.abs(dates[best] - date) ? index : best), 0),
    [dates],
  );

  // Swiping the card selects the position it lands on.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    function onScroll() {
      if (Date.now() < programmaticUntil.current || dragRef.current !== null) return;
      const index = Math.round(scroller!.scrollLeft / scroller!.clientWidth);
      if (index !== activeRef.current) {
        setActive(index);
        setWindowLeft(windowFor(index));
      }
    }
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [windowFor]);

  // While the handle is held near an edge, keep scrolling through the years.
  useEffect(() => {
    if (dragPos === null) return;
    let frame = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      const pos = dragRef.current;
      if (pos !== null) {
        const direction = pos < EDGE_ZONE ? 1 : pos > 1 - EDGE_ZONE ? -1 : 0;
        if (direction !== 0) {
          const next = clampWindow(windowRef.current + direction * EDGE_PAN_SPEED * dt);
          if (next !== windowRef.current) {
            windowRef.current = next;
            setWindowLeft(next);
            select(nearestTo(next - pos * visibleYears), false);
          }
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dragPos !== null, clampWindow, nearestTo, select, visibleYears]); // eslint-disable-line react-hooks/exhaustive-deps

  function pointerPosition(clientX: number) {
    const rect = viewportRef.current!.getBoundingClientRect();
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const pos = pointerPosition(event.clientX);
    setDragPos(pos);
    select(nearestTo(windowLeft - pos * visibleYears), false);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPos === null) return;
    const pos = pointerPosition(event.clientX);
    setDragPos(pos);
    select(nearestTo(windowLeft - pos * visibleYears), false);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPos === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragPos(null);
    setWindowLeft(windowFor(activeRef.current)); // Settle with the selected position in view.
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

  // The full axis is laid out on a strip `span / visibleYears` times wider than the viewport and
  // shifted so the window starting at `windowLeft` is visible.
  const stripWidth = (span / visibleYears) * 100;
  const toStrip = (date: number) => ((axisStart - date) / span) * 100;
  const offset = ((axisStart - windowLeft) / span) * 100;
  const dragging = dragPos !== null;
  const arrowClass =
    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink-200 bg-white text-ink-950 transition-colors hover:border-clay-500 hover:text-clay-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-200 disabled:hover:text-ink-950";
  const handleDate = dragging ? windowLeft - dragPos * visibleYears : dates[active];
  const years = Array.from({ length: span + 1 }, (_, i) => axisStart - i);
  const activeYear = rawDates[active] !== null ? Math.floor(rawDates[active]!) : null;
  const activeEntry = entries[active];

  return (
    <div>
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Left = more recent, matching the axis direction. */}
        <button
          type="button"
          aria-label="More recent position"
          disabled={active === 0}
          onClick={() => select(active - 1)}
          className={arrowClass}
        >
          <span aria-hidden="true">&larr;</span>
        </button>

        {/* The padding leaves room for the labels of the first and last visible years. */}
        <div
          className="relative min-w-0 flex-1 cursor-pointer touch-none select-none overflow-hidden px-8"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div ref={viewportRef} className="relative h-16">
            <div
              className={clsx("absolute inset-y-0 left-0", !dragging && "transition-transform duration-500 ease-out")}
              style={{ width: `${stripWidth}%`, transform: `translateX(-${offset}%)` }}
            >
              {/* Track, highlighted up to the handle */}
              <span aria-hidden="true" className="absolute left-0 right-0 top-[0.6875rem] h-0.5 bg-ink-100" />
              <span
                aria-hidden="true"
                className={clsx("absolute left-0 top-[0.6875rem] h-0.5 bg-clay-500", !dragging && "transition-[width] duration-300")}
                style={{ width: `${toStrip(handleDate)}%` }}
              />

              {/* Year ticks and labels */}
              {years.map((year) => (
                <div key={year} aria-hidden="true">
                  <span className="absolute top-[1.125rem] h-2 w-px -translate-x-1/2 bg-ink-300" style={{ left: `${toStrip(year)}%` }} />
                  <span
                    className={clsx(
                      "absolute top-8 -translate-x-1/2 whitespace-nowrap font-display tabular-nums transition-colors",
                      year === activeYear ? "text-base font-bold text-ink-950" : "text-sm text-ink-400",
                    )}
                    style={{ left: `${toStrip(year)}%` }}
                  >
                    {year}
                  </span>
                </div>
              ))}

              {/* One dot per position */}
              {dates.map((date, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className={clsx(
                    "absolute top-[0.4375rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-2 ring-white transition-colors",
                    date >= handleDate ? "bg-clay-500" : "bg-ink-300",
                  )}
                  style={{ left: `${toStrip(date)}%` }}
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
                  "absolute top-0 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-clay-500 bg-white shadow-md shadow-ink-950/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500",
                  dragging ? "scale-110 cursor-grabbing" : "cursor-grab transition-[left,transform] duration-300",
                )}
                style={{ left: `${toStrip(handleDate)}%` }}
              >
                <span className="h-2 w-2 rounded-full bg-clay-500" />
              </div>
            </div>
          </div>

          {/* Fades hinting at more years beyond the visible window */}
          {windowLeft < axisStart && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"
            />
          )}
          {windowLeft - visibleYears > axisEnd && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"
            />
          )}
        </div>

        <button
          type="button"
          aria-label="Earlier position"
          disabled={active === entries.length - 1}
          onClick={() => select(active + 1)}
          className={arrowClass}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      {/* One position at a time; swipe sideways to move between them */}
      <ol
        ref={scrollerRef}
        aria-label="Work experience"
        className="no-scrollbar mt-4 flex snap-x snap-mandatory items-start overflow-x-auto"
      >
        {entries.map((entry, index) => (
          <li key={`${entry.period}-${entry.position}-${index}`} aria-hidden={index !== active} className="w-full shrink-0 snap-start">
            <div className="max-w-3xl">
              <ExperienceCard entry={entry} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

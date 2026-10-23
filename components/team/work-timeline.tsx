"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ExperienceCard, startYear } from "./team-sections";
import type { TeamExperience } from "@/lib/team";

/** How long scroll events are treated as caused by the slider/arrows rather than the user. */
const PROGRAMMATIC_SCROLL_MS = 1000;

/**
 * Work experience as a horizontally scrolling row of position cards, driven by a year slider:
 * a track with a dot per year (most recent on the left) and a handle that can be dragged,
 * clicked or moved with the keyboard. Dragging scrolls the cards to that year; scrolling the
 * cards moves the handle to the year in view.
 */
export function WorkTimeline({ entries }: { entries: TeamExperience[] }) {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const programmaticUntil = useRef(0);

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(entries.length <= 1);
  /** A year chosen with the slider, kept until the user scrolls the cards themselves. */
  const [pinnedYear, setPinnedYear] = useState<number | null>(null);
  /** Handle position (0–1) while it is being dragged. */
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  const years = entries.map(startYear);
  // Distinct years in order (most recent first), each pointing at its first position.
  const yearStops = years.flatMap((year, index) => (year && years.indexOf(year) === index ? [{ year, index }] : []));
  const lastStop = Math.max(yearStops.length - 1, 1);

  const visibleYear = yearStops.findIndex((stop) => stop.year === years[visibleIndex]);
  const activeYear = pinnedYear ?? Math.max(visibleYear, 0);
  const handlePosition = dragPosition ?? (yearStops.length > 1 ? activeYear / lastStop : 0);

  const update = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const left = scroller.scrollLeft;
    const end = left + scroller.clientWidth >= scroller.scrollWidth - 4;
    // The first card whose left edge is still in view; at the far end, the last card.
    const first = cardRefs.current.findIndex((card) => card && card.offsetLeft - scroller.offsetLeft >= left - 8);
    setVisibleIndex(end || first === -1 ? entries.length - 1 : first);
    setAtEnd(end);
    // A scroll the user made themselves releases the year picked on the slider.
    if (Date.now() > programmaticUntil.current) setPinnedYear(null);
  }, [entries.length]);

  useEffect(() => {
    update();
    const scroller = scrollerRef.current;
    scroller?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scrollToCard(index: number) {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!scroller || !card) return;
    programmaticUntil.current = Date.now() + PROGRAMMATIC_SCROLL_MS;
    scroller.scrollTo({ left: card.offsetLeft - scroller.offsetLeft, behavior: "smooth" });
  }

  function selectYear(stop: number) {
    const clamped = Math.min(Math.max(stop, 0), yearStops.length - 1);
    if (clamped !== pinnedYear) {
      setPinnedYear(clamped);
      scrollToCard(yearStops[clamped].index);
    }
  }

  function positionFromPointer(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (yearStops.length < 2) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const position = positionFromPointer(event.clientX);
    setDragPosition(position);
    selectYear(Math.round(position * lastStop));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPosition === null) return;
    const position = positionFromPointer(event.clientX);
    setDragPosition(position);
    selectYear(Math.round(position * lastStop));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPosition === null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragPosition(null); // The handle settles on the selected year's dot.
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: activeYear + 1,
      ArrowDown: activeYear + 1,
      ArrowLeft: activeYear - 1,
      ArrowUp: activeYear - 1,
      Home: 0,
      End: yearStops.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    selectYear(keys[event.key]);
  }

  const dragging = dragPosition !== null;

  return (
    <div>
      {/* Year slider: dots for every year, most recent on the left, with a draggable handle */}
      {yearStops.length > 1 && (
        <div className="px-3">
          <div
            ref={trackRef}
            className="relative h-14 cursor-pointer touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Track, with the stretch already passed highlighted */}
            <span aria-hidden="true" className="absolute left-0 right-0 top-[0.6875rem] h-0.5 bg-ink-100" />
            <span
              aria-hidden="true"
              className={clsx("absolute left-0 top-[0.6875rem] h-0.5 bg-clay-500", !dragging && "transition-[width] duration-300")}
              style={{ width: `${handlePosition * 100}%` }}
            />

            {/* Year dots and labels */}
            {yearStops.map((stop, index) => {
              const left = `${(index / lastStop) * 100}%`;
              const isActive = index === activeYear;
              const passed = index / lastStop <= handlePosition;
              // On narrow screens only the ends and the active year are labeled, to avoid crowding.
              const alwaysLabeled = isActive || index === 0 || index === yearStops.length - 1;
              return (
                <div key={stop.year} aria-hidden="true">
                  <span
                    className={clsx(
                      "absolute top-2 h-2 w-2 -translate-x-1/2 rounded-full transition-colors",
                      passed ? "bg-clay-500" : "bg-ink-300"
                    )}
                    style={{ left }}
                  />
                  <span
                    className={clsx(
                      "absolute top-7 -translate-x-1/2 whitespace-nowrap font-display tabular-nums transition-all",
                      isActive ? "text-sm font-bold text-ink-950" : "text-xs text-ink-400",
                      !alwaysLabeled && "hidden sm:inline"
                    )}
                    style={{ left }}
                  >
                    {stop.year}
                  </span>
                </div>
              );
            })}

            {/* Handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Year"
              aria-valuemin={0}
              aria-valuemax={yearStops.length - 1}
              aria-valuenow={activeYear}
              aria-valuetext={yearStops[activeYear]?.year}
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
      )}

      {/* Position cards */}
      <div className="relative mt-4">
        <ol
          ref={scrollerRef}
          tabIndex={0}
          aria-label="Work experience positions, scroll sideways for more"
          className="flex snap-x snap-mandatory items-start overflow-x-auto scroll-smooth pb-4 focus-visible:outline-offset-4 [scrollbar-color:theme(colors.ink.200)_transparent] [scrollbar-width:thin]"
        >
          {entries.map((entry, index) => (
            <li
              key={`${entry.period}-${entry.position}-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="w-[85%] shrink-0 snap-start pr-4 sm:w-[21rem]"
            >
              <ExperienceCard entry={entry} />
            </li>
          ))}
        </ol>
        {/* Fade hinting there is more to the right */}
        {!atEnd && (
          <div aria-hidden="true" className="pointer-events-none absolute bottom-4 right-0 top-0 w-12 bg-gradient-to-l from-white to-transparent" />
        )}
      </div>
    </div>
  );
}

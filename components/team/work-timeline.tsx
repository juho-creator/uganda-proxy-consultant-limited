"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ExperienceCard, startYear } from "./team-sections";
import type { TeamExperience } from "@/lib/team";

/**
 * Work experience as a horizontal timeline: one card per position along a rail, scrolled
 * sideways (swipe, trackpad, arrows or the year strip) instead of listing everything at once.
 * The year strip highlights the year currently in view and jumps to any year on click.
 */
export function WorkTimeline({ entries }: { entries: TeamExperience[] }) {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(entries.length <= 1);

  const years = entries.map(startYear);
  // Distinct years in order, each pointing at its first position.
  const yearStops = years.flatMap((year, index) => (year && years.indexOf(year) === index ? [{ year, index }] : []));
  const currentYear = years[current];

  const update = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const left = scroller.scrollLeft;
    // The first card whose left edge hasn't scrolled past the viewport's left edge.
    const index = cardRefs.current.findIndex((card) => card && card.offsetLeft - scroller.offsetLeft >= left - 8);
    setCurrent(index === -1 ? entries.length - 1 : index);
    setAtStart(left <= 4);
    setAtEnd(left + scroller.clientWidth >= scroller.scrollWidth - 4);
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
    scroller.scrollTo({ left: card.offsetLeft - scroller.offsetLeft, behavior: "smooth" });
  }

  function step(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.85, behavior: "smooth" });
  }

  const arrowClass =
    "flex h-9 w-9 items-center justify-center rounded-sm border border-ink-200 bg-white text-ink-950 transition-colors hover:border-ink-400 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div>
      {/* Year strip + controls */}
      <div className="flex items-end justify-between gap-4">
        <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Jump to year">
          {yearStops.map(({ year, index }) => (
            <button
              key={year}
              type="button"
              role="tab"
              aria-selected={year === currentYear}
              onClick={() => scrollToCard(index)}
              className={clsx(
                "shrink-0 rounded-sm px-2.5 py-1.5 font-display text-sm transition-colors",
                year === currentYear ? "bg-ink-950 font-semibold text-white" : "text-ink-500 hover:bg-ink-50 hover:text-ink-950"
              )}
            >
              {year}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs font-semibold tabular-nums text-ink-500 sm:inline">
            {current + 1} / {entries.length}
          </span>
          <button type="button" aria-label="Previous positions" disabled={atStart} onClick={() => step(-1)} className={arrowClass}>
            <span aria-hidden="true">&larr;</span>
          </button>
          <button type="button" aria-label="Next positions" disabled={atEnd} onClick={() => step(1)} className={arrowClass}>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Scrollable timeline */}
      <div className="relative mt-5">
        <ol
          ref={scrollerRef}
          tabIndex={0}
          aria-label="Work experience timeline, scroll sideways for more"
          className="flex snap-x snap-mandatory items-start overflow-x-auto scroll-smooth pb-4 focus-visible:outline-offset-4 [scrollbar-color:theme(colors.ink.200)_transparent] [scrollbar-width:thin]"
        >
          {entries.map((entry, index) => {
            const year = years[index];
            const firstOfYear = year && years.indexOf(year) === index;
            return (
              <li
                key={`${entry.period}-${entry.position}-${index}`}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="w-[85%] shrink-0 snap-start pr-4 sm:w-[21rem]"
              >
                {/* Rail segment with the position's dot and, at each new year, the year label */}
                <div className="relative mb-4 h-7" aria-hidden="true">
                  <span className="absolute left-0 right-0 top-[0.6875rem] h-px bg-ink-200" />
                  <span
                    className={clsx(
                      "absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ring-white",
                      firstOfYear ? "bg-clay-500" : "bg-ink-300"
                    )}
                  />
                  {firstOfYear && (
                    <span className="absolute left-5 top-0 bg-white pr-2 font-display text-base font-semibold text-ink-950">{year}</span>
                  )}
                </div>
                <ExperienceCard entry={entry} />
              </li>
            );
          })}
        </ol>
        {/* Fade hinting there is more to the right */}
        {!atEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-0 top-0 w-12 bg-gradient-to-l from-white to-transparent"
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { clsx } from "clsx";

/**
 * Blinking up/down arrows pinned to the top and bottom center of the viewport, used by the
 * homepage slide deck. Each arrow only shows while there is a slide to go to in that direction.
 */
export function ScrollArrows({
  canUp,
  canDown,
  onUp,
  onDown,
}: {
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <>
      <ArrowButton direction="up" visible={canUp} onClick={onUp} />
      <ArrowButton direction="down" visible={canDown} onClick={onDown} />
    </>
  );
}

function ArrowButton({
  direction,
  visible,
  onClick,
}: {
  direction: "up" | "down";
  visible: boolean;
  onClick: () => void;
}) {
  // Drawn pointing down, then flipped for "up": two chevrons that blink in sequence, pointing
  // the way to go.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "up" ? "Scroll up" : "Scroll down"}
      tabIndex={visible ? 0 : -1}
      className={clsx(
        "fixed left-1/2 z-30 flex -translate-x-1/2 flex-col items-center px-3 py-1 text-clay-500 transition-opacity duration-300 hover:text-clay-600",
        direction === "up" ? "top-[4.5rem] rotate-180 lg:top-[5.5rem]" : "bottom-4",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {[0, 1].map((index) => (
        <svg
          key={index}
          viewBox="0 0 20 10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
          className={clsx("arrow-blink h-2.5 w-5", index === 1 && "-mt-0.5")}
          style={{ animationDelay: `${index * 0.25}s` }}
          aria-hidden="true"
        >
          <path d="M2 2l8 6 8-6" />
        </svg>
      ))}
    </button>
  );
}

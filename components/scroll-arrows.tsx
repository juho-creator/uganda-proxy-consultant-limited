"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * Blinking up/down arrows pinned to the top and bottom center of the viewport. Each arrow only
 * shows while there is somewhere to go in that direction, and steps one "screen" when clicked.
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "up" ? "Scroll up" : "Scroll down"}
      tabIndex={visible ? 0 : -1}
      className={clsx(
        "fixed left-1/2 z-30 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-ink-200 bg-white/90 text-ink-950 shadow-md shadow-ink-950/10 backdrop-blur transition-opacity duration-300 hover:text-clay-600",
        direction === "up" ? "top-[4.75rem] lg:top-[5.75rem]" : "bottom-5",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx("arrow-blink h-5 w-5", direction === "down" && "rotate-180")}
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

/**
 * Window-scroll version used on regular pages. Stays hidden on pages that lock the document
 * scroll (the homepage slide deck), which render their own ScrollArrows instead.
 */
export function PageScrollArrows() {
  const pathname = usePathname();
  const [state, setState] = useState({ canUp: false, canDown: false });

  useEffect(() => {
    function update() {
      const root = document.documentElement;
      if (root.style.overflow === "hidden") {
        setState({ canUp: false, canDown: false });
        return;
      }
      const maxScroll = root.scrollHeight - window.innerHeight;
      setState({
        canUp: window.scrollY > 8,
        canDown: window.scrollY < maxScroll - 8,
      });
    }

    // Defer one frame so a page's own mount effects (e.g. the deck locking scroll) have run.
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const step = () => Math.round(window.innerHeight * 0.85);

  return (
    <ScrollArrows
      canUp={state.canUp}
      canDown={state.canDown}
      onUp={() => window.scrollBy({ top: -step(), behavior: "smooth" })}
      onDown={() => window.scrollBy({ top: step(), behavior: "smooth" })}
    />
  );
}

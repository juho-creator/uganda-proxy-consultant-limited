"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { ScrollArrows } from "./scroll-arrows";

const TRANSITION_MS = 650;
/**
 * One trackpad swipe or fast wheel flick fires a continuous stream of wheel events (including
 * momentum that keeps arriving after the finger lifts). Events closer together than this belong
 * to the same gesture, and a gesture may move at most one slide.
 */
const GESTURE_GAP_MS = 200;

/**
 * Fullscreen scroll-snap slideshow for the homepage: each direct child becomes one
 * viewport-height slide, with a fixed dot indicator on the right edge showing which slide is
 * active (click a dot to jump to that slide).
 *
 * CSS scroll-snap alone feels sticky/inconsistent with trackpads and mouse wheels (small deltas
 * fight the snap point, often taking several gestures to move on). So wheel and arrow-key input
 * are intercepted here to advance exactly one slide per gesture — falling back to native scroll
 * only when the current slide's own content overflows and hasn't reached that edge yet.
 */
export function SlideDeck({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const lastWheelAtRef = useRef(0);
  const slides = Children.toArray(children);

  const goToSlide = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const clamped = Math.max(0, Math.min(index, slides.length - 1));
      animatingRef.current = true;
      activeRef.current = clamped;
      setActive(clamped);
      container.scrollTo({ top: clamped * container.clientHeight, behavior: "smooth" });
      window.setTimeout(() => {
        animatingRef.current = false;
      }, TRANSITION_MS);
    },
    [slides.length]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      if (animatingRef.current) return;
      const { scrollTop, clientHeight } = container!;
      if (clientHeight === 0) return;
      const index = Math.round(scrollTop / clientHeight);
      activeRef.current = index;
      setActive(index);
    }

    function handleWheel(event: WheelEvent) {
      const now = performance.now();
      const isNewGesture = now - lastWheelAtRef.current > GESTURE_GAP_MS;
      lastWheelAtRef.current = now;

      if (animatingRef.current) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const currentSlide = container!.children[activeRef.current] as HTMLElement | undefined;
      if (!currentSlide) return;

      const atTop = currentSlide.scrollTop <= 0;
      const atBottom = currentSlide.scrollTop + currentSlide.clientHeight >= currentSlide.scrollHeight - 1;

      // Let the current slide's own content scroll natively until its edge is reached, so
      // overflowing slides stay readable — only then does a further nudge move to the next slide.
      if ((direction > 0 && !atBottom) || (direction < 0 && !atTop)) return;

      event.preventDefault();
      // Only the start of a gesture changes slides — the rest of its stream (and any momentum) is
      // swallowed, so a single scroll can never skip past a page.
      if (!isNewGesture) return;
      goToSlide(activeRef.current + direction);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (animatingRef.current) return;

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goToSlide(activeRef.current + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goToSlide(activeRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSlide(slides.length - 1);
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToSlide, slides.length]);

  useEffect(() => {
    // The deck owns its own scroll region (sized to the viewport), so the outer page must never
    // scroll too — otherwise the browser shows a second, redundant scrollbar alongside the deck's.
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="no-scrollbar h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-auto scroll-smooth lg:h-[calc(100vh-5rem)]"
      >
        {slides.map((slide, index) => (
          <div key={index} className="no-scrollbar h-full snap-start snap-always overflow-y-auto">
            {slide}
          </div>
        ))}
      </div>

      <div
        aria-label="Slide navigation"
        role="tablist"
        className="fixed right-5 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-8"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={`Go to slide ${index + 1} of ${slides.length}`}
            onClick={() => goToSlide(index)}
            className="flex h-4 w-4 items-center justify-center"
          >
            <span
              className={clsx(
                "rounded-full transition-all duration-300",
                active === index ? "h-2.5 w-2.5 bg-ink-950" : "h-2 w-2 bg-ink-300 hover:bg-ink-500"
              )}
            />
          </button>
        ))}
      </div>

      <ScrollArrows
        canUp={active > 0}
        canDown={active < slides.length - 1}
        onUp={() => goToSlide(activeRef.current - 1)}
        onDown={() => goToSlide(activeRef.current + 1)}
      />
    </div>
  );
}

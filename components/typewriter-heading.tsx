"use client";

import { useEffect, useState } from "react";

type TypewriterHeadingProps = {
  text: string;
  className?: string;
  typingSpeedMs?: number;
};

/** Types `text` out character by character with a blinking caret; shows the full text instantly under reduced-motion. */
export function TypewriterHeading({ text, className, typingSpeedMs = 45 }: TypewriterHeadingProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setCharCount(text.length);
      return;
    }

    setCharCount(0);
    const interval = setInterval(() => {
      setCharCount((count) => {
        if (count >= text.length) {
          clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, typingSpeedMs);

    return () => clearInterval(interval);
  }, [text, typingSpeedMs]);

  return (
    <h1 className={className} aria-label={text}>
      {/* The untyped remainder stays in the DOM (just hidden) so the browser wraps lines
          against the final text from the very first frame — nothing reflows as it types. */}
      <span aria-hidden="true">{text.slice(0, charCount)}</span>
      <span aria-hidden="true" className="typewriter-cursor" />
      <span aria-hidden="true" className="invisible">
        {text.slice(charCount)}
      </span>
    </h1>
  );
}

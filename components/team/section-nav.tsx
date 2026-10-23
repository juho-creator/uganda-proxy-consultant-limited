"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

/** "On this page" links that highlight (bold + accent bar) the section currently being read. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    function update() {
      // The active section is the last one whose top has passed a line ~30% down the viewport.
      const line = window.innerHeight * 0.3;
      let current = elements[0]?.id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element.id;
      }
      // At the very bottom, the last section is active even if it's too short to reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = elements[elements.length - 1]?.id ?? current;
      }
      setActive(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <nav aria-label="Profile sections" className="sticky top-28">
      <p className="font-display text-xs font-semibold uppercase tracking-widest text-ink-400">On this page</p>
      <ul className="mt-3 space-y-1 border-l border-ink-100">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(section.id)}
                className={clsx(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  isActive
                    ? "border-clay-500 font-bold text-ink-950"
                    : "border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-950"
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

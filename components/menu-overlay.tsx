"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { NAV_ITEMS } from "@/lib/content";

/**
 * Navigation dropdown panel — sits just below the sticky header (not a full-screen takeover),
 * sized to its content, with the rest of the page still visible beneath it. Modeled on
 * dohwa.co.kr's "MENU" panel: every section listed as a column of links, closing on Escape
 * or on a click outside the panel.
 */
export function MenuOverlay({
  open,
  onClose,
  triggerRef,
  autoFocus = true,
  onPointerEnter,
  onPointerLeave,
}: {
  open: boolean;
  onClose: () => void;
  /** The header's toggle button — excluded from the outside-click check so its own onClick can handle closing without the two handlers fighting each other. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Move focus into the panel on open — off when the menu was opened by mouse hover. */
  autoFocus?: boolean;
  onPointerEnter?: (event: React.PointerEvent) => void;
  onPointerLeave?: (event: React.PointerEvent) => void;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    if (autoFocus) {
      const firstLink = panelRef.current?.querySelector("a");
      (firstLink as HTMLElement | null)?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onClose, autoFocus]);

  return (
    <div
      ref={panelRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={clsx(
        "fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink-100 bg-white text-ink-950 shadow-2xl shadow-ink-950/10 transition-all duration-300 ease-out lg:top-20 lg:max-h-[calc(100vh-5rem)]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      )}
    >
      <div className="mx-auto w-full max-w-content px-6 py-10 sm:py-12 lg:px-8">
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.label}
              className={clsx(
                "transition-all duration-300 ease-out",
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              )}
              style={{ transitionDelay: open ? `${40 + index * 40}ms` : "0ms" }}
            >
              {item.children ? (
                <div className="group/col">
                  <div className="relative inline-block pb-2.5">
                    <p className="font-display text-xl font-bold uppercase tracking-wide text-ink-950 sm:text-2xl">
                      {item.label}
                    </p>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-100" />
                    <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-clay-500 transition-transform duration-300 ease-out group-hover/col:scale-x-100" />
                  </div>
                  <ul className="mt-5 space-y-4">
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={clsx(
                              "group/link inline-block",
                              active ? "text-clay-600" : "text-ink-950 hover:text-clay-600"
                            )}
                          >
                            <span className="font-display text-base font-semibold leading-snug transition-colors sm:text-lg">
                              {child.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    "inline-block",
                    pathname === item.href ? "text-clay-600" : "text-ink-950 hover:text-clay-600"
                  )}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">&nbsp;</p>
                  <span className="mt-4 block font-display text-xl font-semibold leading-snug transition-colors sm:text-2xl">
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

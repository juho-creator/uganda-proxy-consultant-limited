"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Container } from "./container";
import { MenuOverlay } from "./menu-overlay";

export function SiteHeader() {
  const pathname = usePathname();
  // The admin area has its own navigation (dashboard, View site, Log out), so the site menu is hidden there.
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // True while the menu is open only because the mouse is hovering it — such a menu closes again
  // once the pointer leaves both the trigger and the panel. A click "pins" it open instead.
  const [openedByHover, setOpenedByHover] = useState(false);
  const closeTimerRef = useRef<number | undefined>(undefined);

  const cancelClose = useCallback(() => window.clearTimeout(closeTimerRef.current), []);
  const close = useCallback(() => {
    cancelClose();
    setOpen(false);
    setOpenedByHover(false);
  }, [cancelClose]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => cancelClose, [cancelClose]);

  function handlePointerEnter(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    if (!open) {
      setOpen(true);
      setOpenedByHover(true);
    }
  }

  function handlePointerLeave(event: React.PointerEvent) {
    if (event.pointerType !== "mouse" || !openedByHover) return;
    cancelClose();
    // Short grace period so the pointer can cross the gap between the button and the panel.
    closeTimerRef.current = window.setTimeout(close, 250);
  }

  function handleClick() {
    if (open && openedByHover) {
      cancelClose();
      setOpenedByHover(false);
      return;
    }
    if (open) close();
    else setOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/95 text-ink-950 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <Link
          href="/"
          onClick={close}
          className="flex items-baseline gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay-500"
        >
          <span className="font-display text-lg font-semibold tracking-tight lg:text-xl">Proxy Consultants</span>
          <span className="hidden font-display text-lg font-semibold text-clay-600 lg:inline">Ltd</span>
        </Link>

        {!isAdminArea && (
          <button
            ref={triggerRef}
            type="button"
            onClick={handleClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            aria-expanded={open}
            aria-controls="site-menu"
            className="inline-flex items-center gap-3 rounded-sm px-2 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-ink-950 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500"
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-4 w-6">
              <span
                className={clsx(
                  "absolute left-0 top-0 block h-0.5 w-6 bg-current transition-transform duration-300",
                  open && "translate-y-[7px] rotate-45"
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity duration-200",
                  open && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "absolute bottom-0 left-0 block h-0.5 w-6 bg-current transition-transform duration-300",
                  open && "-translate-y-[7px] -rotate-45"
                )}
              />
            </span>
          </button>
        )}
      </Container>

      {!isAdminArea && (
        <MenuOverlay
          open={open}
          onClose={close}
          triggerRef={triggerRef}
          autoFocus={!openedByHover}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COMPANY, PROXY_NAV } from "@/lib/proxy/company";
import { CloseIcon, MenuIcon } from "@/components/imme/imme-icons";

/**
 * Sticky public header for the Proxy Consultants Ltd corporate site. Two-row layout: a compact
 * brand + CTA row, then a full-width primary nav strip that can comfortably hold all ten
 * navigation labels (including the long "International Technical Partnerships") without
 * truncating any of them — collapsing to a slide-over panel below `lg`.
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={[
        "sticky top-0 z-40 w-full transition-[box-shadow,background-color,border-color] duration-300",
        scrolled
          ? "border-b border-imme-line bg-white/92 shadow-imme-card backdrop-blur-xl"
          : "border-b border-transparent bg-white/85 backdrop-blur-md",
      ].join(" ")}
    >
      <div
        aria-hidden
        className={[
          "h-[3px] w-full bg-gradient-to-r from-imme-navy via-imme-amber to-imme-green transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-70",
        ].join(" ")}
      />

      <div className="imme-container-wide flex min-h-[64px] items-center gap-3 py-2.5 sm:min-h-[72px]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-xl pr-2 outline-none ring-imme-amber transition hover:bg-imme-concrete/80 focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={`${COMPANY.name} — Home`}
        >
          <BrandMark />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[15px] font-bold tracking-tight text-imme-navy sm:text-base">
              {COMPANY.name}
            </span>
            <span className="hidden text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-imme-muted sm:inline">
              Engineering &amp; Digital Consultancy
            </span>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <Link href="/contact" className="hidden sm:inline-flex imme-btn-primary">
            Contact Us
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="proxy-mobile-nav"
            className="inline-flex items-center justify-center rounded-xl border border-imme-line bg-white p-2.5 text-imme-navy shadow-sm transition hover:border-imme-navy/25 hover:bg-imme-concrete lg:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="hidden border-t border-imme-line/70 bg-imme-concrete/50 lg:block"
      >
        <div className="imme-container-wide flex flex-wrap items-center justify-center gap-x-1 gap-y-1 py-1.5">
          {PROXY_NAV.map((item) => (
            <DesktopNavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation" id="proxy-mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-imme-navy/35 backdrop-blur-[3px]"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,380px)] flex-col bg-white shadow-2xl ring-1 ring-imme-navy/10">
            <div className="flex items-center justify-between border-b border-imme-line px-4 py-3">
              <p className="font-display text-sm font-bold text-imme-navy">Menu</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-imme-line p-2 text-imme-muted transition hover:bg-imme-concrete"
                aria-label="Close menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <div className="flex flex-col gap-1">
                {PROXY_NAV.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "rounded-xl px-3 py-3 text-sm font-semibold transition",
                        active ? "bg-imme-navy text-white" : "text-imme-ink hover:bg-imme-concrete",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 border-t border-imme-line pt-4">
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="imme-btn-primary w-full justify-center">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

type NavItem = (typeof PROXY_NAV)[number];

function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <Link
      href={item.href}
      className={[
        "rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition",
        active ? "bg-imme-navy text-white shadow-sm" : "text-imme-ink hover:bg-white hover:shadow-sm",
      ].join(" ")}
    >
      {item.label}
    </Link>
  );
}

/** Brand mark: a monogram "PC" badge standing in for a logo file. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={[
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-imme-navy to-imme-navy-700 text-white shadow-imme-card ring-2 ring-white sm:h-11 sm:w-11",
        className,
      ].join(" ")}
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 26V8l8-2 8 2v18" />
        <path d="M6 26h20" />
        <path d="M12 26v-6h4v6" />
        <path d="M10 12h2M10 16h2M20 12h2M20 16h2" stroke="#E6A86A" />
      </svg>
    </span>
  );
}

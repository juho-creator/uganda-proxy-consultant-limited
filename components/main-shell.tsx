"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ImmePublicShell } from "@/components/imme/imme-public-shell";
import { ProxyPublicShell } from "@/components/proxy/proxy-public-shell";

/**
 * Top-level routing dispatch:
 *
 *   - Corporate Proxy Consultants Ltd routes (Home, About Us, Our Services, Our Experience,
 *     Selected Projects, International Technical Partnerships, Our Team, Clients & Partners,
 *     News & Insights, Contact Us) render under `ProxyPublicShell` (company header + footer).
 *   - The IMME Project delivery tool (Manuals, BMS, Progress, Capacity Building — one of Proxy
 *     Consultants' selected projects, linked from `/projects`) keeps its own `ImmePublicShell`
 *     header + footer, unchanged.
 *   - Auth pages (`/login`, `/signup`) keep their custom branded full-bleed layout.
 *   - Authenticated staff workspace (admin, users, dashboard, folders, files) keeps the
 *     legacy `Navbar` + the existing `.ui-shell` content container.
 */
const STAFF_PREFIXES = ["/admin", "/users", "/dashboard", "/folders", "/files", "/search"];
const IMME_PROJECT_PREFIXES = ["/manuals", "/bms", "/progress", "/capacity-building"];
const AUTH_ROUTES = new Set(["/login", "/signup"]);

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";

  if (AUTH_ROUTES.has(pathname)) {
    /** Auth pages own their own full-bleed branded chrome. */
    return <main className="min-h-screen w-full">{children}</main>;
  }

  if (matchesPrefix(pathname, STAFF_PREFIXES)) {
    return (
      <>
        <Navbar />
        <main className="ui-shell">{children}</main>
      </>
    );
  }

  if (matchesPrefix(pathname, IMME_PROJECT_PREFIXES)) {
    return <ImmePublicShell>{children}</ImmePublicShell>;
  }

  return <ProxyPublicShell>{children}</ProxyPublicShell>;
}

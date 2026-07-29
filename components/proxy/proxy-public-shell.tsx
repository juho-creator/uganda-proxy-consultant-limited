"use client";

import { ReactNode } from "react";
import { SiteHeader } from "@/components/proxy/site-header";
import { SiteFooter } from "@/components/proxy/site-footer";

/**
 * Wraps the public Proxy Consultants Ltd site (Home / About / Services / Experience / Projects /
 * Partnerships / Team / Clients / News / Contact) in the public header + footer chrome. See
 * `MainShell` for the routing dispatch that decides which shell a given path renders under.
 */
export function ProxyPublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-imme-concrete">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_85%_50%_at_50%_-10%,rgba(26,45,79,0.06),transparent_55%),radial-gradient(ellipse_60%_40%_at_100%_40%,rgba(200,129,58,0.05),transparent_50%)]"
      />
      <SiteHeader />
      <main className="relative flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

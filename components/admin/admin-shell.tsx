import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "../container";
import { LogoutButton } from "./admin-controls";

/** Page frame for the signed-in admin area: title bar with breadcrumb, "View site" and "Log out". */
export function AdminShell({ title, back, children }: { title: string; back?: boolean; children: ReactNode }) {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <Container className="flex flex-wrap items-end justify-between gap-4 py-10">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-600">
              {back ? (
                <Link href="/admin" className="hover:text-clay-700">
                  &larr; Admin dashboard
                </Link>
              ) : (
                "Admin"
              )}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-ink-600 transition-colors hover:text-clay-600">
              View site
            </Link>
            <LogoutButton />
          </div>
        </Container>
      </section>
      <section className="py-12 sm:py-16">
        <Container>{children}</Container>
      </section>
    </>
  );
}

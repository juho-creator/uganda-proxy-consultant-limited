import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Container } from "./container";
import { RouteMotif } from "./route-motif";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
};

/** Compact dark hero used to open every interior page, echoing the homepage hero treatment. */
export function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-16 pt-32 text-white lg:pb-20 lg:pt-40">
      <RouteMotif variant="hero" className="pointer-events-none absolute inset-0 h-full w-full text-ink-600" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/10 via-ink-950/60 to-ink-950" />
      <Container className="relative">
        {eyebrow && <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-300">{eyebrow}</p>}
        <h1 className={clsx("max-w-3xl font-display font-semibold tracking-tight text-5xl sm:text-6xl", eyebrow && "mt-4")}>{title}</h1>
        {children}
      </Container>
    </section>
  );
}

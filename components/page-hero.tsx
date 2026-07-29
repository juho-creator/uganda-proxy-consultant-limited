import type { ReactNode } from "react";
import { Container } from "./container";
import { RouteMotif } from "./route-motif";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

/** Compact dark hero used to open every interior page, echoing the homepage hero treatment. */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-16 pt-32 text-white lg:pb-20 lg:pt-40">
      <RouteMotif variant="hero" className="pointer-events-none absolute inset-0 h-full w-full text-ink-600" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/10 via-ink-950/60 to-ink-950" />
      <Container className="relative">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-300">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200">{description}</p>}
        {children}
      </Container>
    </section>
  );
}

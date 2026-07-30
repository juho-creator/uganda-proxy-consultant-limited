import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { RouteMotif } from "@/components/route-motif";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { Reveal } from "@/components/reveal";
import { SlideDeck } from "@/components/slide-deck";
import { TypewriterHeading } from "@/components/typewriter-heading";
import { CLIENTS, FEATURED_SERVICES, VALUES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Proxy Consultants Ltd is a Ugandan engineering consultancy delivering transport infrastructure and digital technology solutions across East Africa.",
};

export default function HomePage() {
  return (
    <SlideDeck>
      {/* Hero */}
      <section className="relative flex h-full items-center overflow-hidden bg-ink-950 text-white">
        <RouteMotif variant="hero" className="pointer-events-none absolute inset-0 h-full w-full text-ink-600" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/20 via-ink-950/70 to-ink-950" />
        <Container className="relative py-16">
          <TypewriterHeading
            text="Engineering Uganda’s transport infrastructure, and its digital future."
            className="max-w-3xl font-display text-4xl font-semibold leading-[1.5] tracking-tight sm:text-5xl sm:leading-[1.5] lg:text-6xl lg:leading-[1.5]"
          />
        </Container>
      </section>

      {/* Our values */}
      <section className="flex h-full items-center border-b border-ink-100 bg-ink-50">
        <Container className="py-16">
          <Reveal>
            <SectionHeading eyebrow="What Guides Us" title="Our values" align="center" />
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <div className="h-full border border-ink-200 bg-white p-6 text-center">
                  <h3 className="font-display text-base font-semibold text-ink-950">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Core services snapshot */}
      <section className="flex h-full items-center">
        <Container className="py-16">
          <Reveal>
            <SectionHeading eyebrow="What We Do" title="Core services" />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={index * 60}>
                <ServiceCard service={service} index={index} showBlurb={false} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950 hover:text-clay-600">
              View all services
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="flex h-full items-center border-y border-ink-100">
        <Container className="py-16">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-ink-400">
              Trusted by government institutions and international engineering firms
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {CLIENTS.map((client, index) => (
              <Reveal key={client.name} delay={index * 60}>
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${client.name} (opens in a new tab)`}
                  className="flex h-full flex-col items-center justify-center gap-3 border border-ink-100 px-4 py-6 transition-colors hover:border-ink-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500"
                >
                  <div className="relative h-14 w-full">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                    />
                  </div>
                  <p className="sr-only">{client.name}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </SlideDeck>
  );
}

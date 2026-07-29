import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CLIENTS, SECTORS_SERVED } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clients & Partners",
  description:
    "Proxy Consultants Ltd works with Dohwa Engineering, Korea Expressway Corporation, the Ministry of Works and Transport, and UNRA.",
};

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients & Partners"
        title="Working alongside government institutions and international engineering firms."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Who We Work With" title="Clients and partners" />
          </Reveal>
          {/* Flexible logo/name grid — ready to extend as new clients are added. */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENTS.map((client, index) => (
              <Reveal key={client.name} delay={index * 60}>
                <div className="flex h-full flex-col items-center justify-center gap-2 border border-ink-100 px-6 py-10 transition-colors hover:border-ink-300">
                  <div className="relative h-16 w-full">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 28vw"
                    />
                  </div>
                  <p className="sr-only">{client.name}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 border-t border-ink-100 pt-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-ink-400">Sectors served</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {SECTORS_SERVED.map((sector) => (
                <span key={sector} className="border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700">
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

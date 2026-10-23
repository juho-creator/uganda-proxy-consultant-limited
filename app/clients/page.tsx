import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CLIENTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clients & Partners",
  description:
    "Proxy Consultants Ltd works with Dohwa Engineering, Korea Expressway Corporation, the Ministry of Works and Transport, and UNRA.",
};

export default function ClientsPage() {
  return (
    <>
      <PageHero title="Clients & Partners" />

      <section className="py-20 sm:py-28">
        <Container>
          {/* Flexible logo/name grid — ready to extend as new clients are added. */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENTS.map((client, index) => (
              <Reveal key={client.name} delay={index * 60}>
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${client.name} website (opens in a new tab)`}
                  className="group flex h-full flex-col items-center justify-center gap-4 border border-ink-100 px-6 py-10 transition-colors hover:border-ink-300 hover:shadow-lg hover:shadow-ink-950/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500"
                >
                  <div className="relative h-16 w-full">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 28vw"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-400 transition-colors group-hover:text-clay-600">
                    Visit website
                    <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      &#8599;
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

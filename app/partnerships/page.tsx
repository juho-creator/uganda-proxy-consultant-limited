import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { PARTNERSHIP_SERVICE_AREAS } from "@/lib/content";

export const metadata: Metadata = {
  title: "International Technical Partnerships",
  description:
    "Proxy Consultants Ltd partners with a network of engineering specialists from the Republic of Korea, combining international best practice with local knowledge.",
};

export default function PartnershipsPage() {
  return (
    <>
      <PageHero title="International Technical Partnerships" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <div className="space-y-6">
              <Reveal>
                <p className="text-base leading-relaxed text-ink-700">
                  Proxy Consultants Ltd has established strategic partnerships with experienced
                  engineering professionals and subject matter experts from the Republic of
                  Korea, giving clients access to internationally recognised expertise in
                  transport infrastructure development.
                </p>
              </Reveal>
              <Reveal delay={60}>
                <p className="text-base leading-relaxed text-ink-700">
                  Our on-call Korean experts bring extensive experience in the planning, design,
                  construction, operation and maintenance of expressways and bridges, as well as
                  infrastructure asset management systems. This collaboration combines local
                  knowledge with global best practice.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-base leading-relaxed text-ink-700">
                  By combining local expertise with international technical support, Proxy
                  Consultants Ltd is positioned to deliver complex infrastructure projects to the
                  highest professional standards.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950 hover:text-clay-600">
                  See projects delivered through this partnership
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="border border-ink-100 bg-ink-50 p-8">
                <SectionHeading eyebrow="Strengthened By This Partnership" title="Specialised service areas" />
                <ul className="mt-6 space-y-3">
                  {PARTNERSHIP_SERVICE_AREAS.map((area) => (
                    <li key={area} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

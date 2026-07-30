import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ABOUT_PARAGRAPHS } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Proxy Consultants Ltd is a Ugandan engineering consultancy delivering transport infrastructure and digital technology solutions, backed by a network of Korean engineering specialists.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="Who We Are" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <div className="space-y-6">
              {ABOUT_PARAGRAPHS.map((paragraph, index) => (
                <Reveal key={index} delay={index * 60}>
                  <p className="text-base leading-relaxed text-ink-700">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="border border-ink-100 bg-ink-50 p-8">
                <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-600">Focus Areas</p>
                <ul className="mt-5 space-y-3 text-sm text-ink-700">
                  <li>Transport planning and infrastructure advisory</li>
                  <li>Engineering design and technical review</li>
                  <li>Operations, maintenance and asset management</li>
                  <li>Bridge management systems</li>
                  <li>PPP and infrastructure policy advisory</li>
                  <li>Website and custom software development</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

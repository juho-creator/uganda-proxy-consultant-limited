import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TEAM } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership and engineering team at Proxy Consultants Ltd.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero title="Our Team" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            {TEAM.map((member, index) => (
              <Reveal key={member.name} delay={index * 60}>
                <div className="border border-ink-100 bg-white">
                  <div className="flex aspect-[4/5] items-center justify-center bg-ink-50">
                    <span className="font-display text-sm font-medium text-ink-300">Photo</span>
                  </div>
                  <div className="p-6">
                    <p className="font-display text-lg font-semibold text-ink-950">{member.name}</p>
                    <p className="mt-0.5 text-sm font-medium text-clay-600">{member.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

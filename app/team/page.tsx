import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the engineering and technical team at Proxy Consultants Ltd.",
};

// Team member content to be supplied by client. Placeholder profiles below establish the
// grid layout (photo, name, title, short bio) and can be replaced with real team data.
const TEAM_PLACEHOLDERS = [
  { name: "Name Surname", title: "Position Title", bio: "Short professional biography to be provided." },
  { name: "Name Surname", title: "Position Title", bio: "Short professional biography to be provided." },
  { name: "Name Surname", title: "Position Title", bio: "Short professional biography to be provided." },
  { name: "Name Surname", title: "Position Title", bio: "Short professional biography to be provided." },
];

export default function TeamPage() {
  return (
    <>
      <PageHero title="Our Team" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_PLACEHOLDERS.map((member, index) => (
              <Reveal key={index} delay={index * 60}>
                <div className="border border-ink-100 bg-white">
                  <div className="flex aspect-[4/5] items-center justify-center bg-ink-50">
                    <span className="font-display text-sm font-medium text-ink-300">Photo</span>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-base font-semibold text-ink-950">{member.name}</p>
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

import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EXPERIENCE_AREAS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Experience",
  description:
    "Proxy Consultants Ltd's expertise spans transport planning, expressway O&M manuals, bridge management systems, PPP guidelines and infrastructure policy development.",
};

export default function ExperiencePage() {
  const mid = Math.ceil(EXPERIENCE_AREAS.length / 2);
  const columns = [EXPERIENCE_AREAS.slice(0, mid), EXPERIENCE_AREAS.slice(mid)];

  return (
    <>
      <PageHero title="Our Experience" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
            {columns.map((column, colIndex) => (
              <ul key={colIndex} className="space-y-4">
                {column.map((area, index) => (
                  <Reveal key={area} delay={index * 50}>
                    <li className="flex gap-4 border-b border-ink-100 pb-4">
                      <span className="font-display text-sm font-semibold text-clay-500">
                        {String(colIndex * mid + index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed text-ink-700">{area}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

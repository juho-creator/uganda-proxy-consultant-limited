import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Selected Projects",
  description:
    "Selected consultancy assignments delivered for Dohwa Engineering Co. Ltd and Korea Expressway Corporation on Uganda's expressway network.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected Projects"
        title="Consultancy assignments delivered for Uganda's expressway network."
        description="A selection of assignments completed with international engineering partners and government institutions."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="space-y-6">
            {PROJECTS.map((project, index) => (
              <Reveal key={project.id} delay={index * 60}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

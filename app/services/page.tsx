import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { Reveal } from "@/components/reveal";
import { SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Transport planning, highway and bridge engineering, operations and maintenance, asset management, PPP advisory, and digital solutions from Proxy Consultants Ltd.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Engineering and digital services for transport infrastructure programmes."
        description="A full range of consultancy capabilities, from transport planning and engineering design through to operations, asset management and digital delivery."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={(index % 6) * 60}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

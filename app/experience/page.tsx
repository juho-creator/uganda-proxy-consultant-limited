import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { EXPERTISE_AREAS, SELECTED_PROJECTS } from "@/lib/proxy/company";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "Our Experience",
  description:
    "Proxy Consultants Ltd has successfully delivered consultancy services on strategic transport infrastructure projects in Uganda, working alongside international engineering firms and government agencies.",
};

export default function ExperiencePage() {
  return (
    <PageShell
      eyebrow="Our experience"
      title="Strategic transport infrastructure work across Uganda"
      subtitle="Proxy Consultants Ltd has successfully delivered consultancy services on strategic transport infrastructure projects in Uganda, working alongside international engineering firms and government agencies."
      breadcrumbs={[{ label: "Our Experience" }]}
    >
      <PageSection eyebrow="Expertise" title="Our expertise includes">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE_AREAS.map((area) => (
            <li key={area} className="flex items-start gap-3 rounded-imme border border-imme-line bg-white p-4 shadow-imme-card">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-imme-green" />
              <span className="text-sm leading-6 text-imme-ink">{area}</span>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        variant="concrete"
        eyebrow="Track record"
        title="Delivered alongside international partners and government agencies"
        description="Our project delivery record includes work commissioned by Korean engineering firms and consulted with Uganda's own transport institutions."
      >
        <ul className="grid gap-5 lg:grid-cols-2">
          {SELECTED_PROJECTS.map((project) => (
            <li key={project.id} className="rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
              <p className="font-mono text-[11px] uppercase tracking-wider text-imme-amber">
                {project.client}, {project.clientCountry}
              </p>
              <h3 className="mt-2 font-display text-base font-bold leading-snug text-imme-navy">{project.title}</h3>
            </li>
          ))}
        </ul>
        <Link href="/projects" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber">
          View selected projects in detail
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>
    </PageShell>
  );
}

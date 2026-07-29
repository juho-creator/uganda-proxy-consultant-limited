import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { SELECTED_PROJECTS } from "@/lib/proxy/company";
import { ArrowRightIcon, ToolboxIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "Selected Projects",
  description:
    "Selected consultancy projects delivered by Proxy Consultants Ltd for Dohwa Engineering Co. Ltd and Korea Expressway Corporation on Uganda's expressway network.",
};

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow="Selected projects"
      title="Consultancy delivered for Uganda's expressway network"
      subtitle="A selection of the strategic infrastructure engagements Proxy Consultants Ltd has delivered alongside international engineering firms."
      breadcrumbs={[{ label: "Selected Projects" }]}
    >
      <PageSection>
        <ol className="space-y-6">
          {SELECTED_PROJECTS.map((project, idx) => (
            <li key={project.id} className="rounded-imme border border-imme-line bg-white p-6 shadow-imme-card sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-imme-navy text-white font-display text-sm font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug text-imme-navy sm:text-xl">{project.title}</h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-imme-amber">
                      Client — {project.client} ({project.clientCountry})
                    </p>
                  </div>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-imme-navy/5 text-imme-navy">
                  <ToolboxIcon className="h-5 w-5" />
                </span>
              </div>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {project.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm leading-6 text-imme-muted">
                    <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-imme-amber" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              {project.isImmeProject ? (
                <Link
                  href="/manuals"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber"
                >
                  Explore the IMME Project manuals &amp; BMS
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection
        variant="navy"
        eyebrow="International technical partnerships"
        title="Every project draws on our Korean specialist network"
        description="Our on-call partnership with engineering professionals from the Republic of Korea underpins the technical depth behind each of these engagements."
      >
        <Link href="/partnerships" className="imme-btn-amber">
          See the partnership
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>
    </PageShell>
  );
}

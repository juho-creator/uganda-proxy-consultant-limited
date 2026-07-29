import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { PARTNERSHIP_SPECIALTIES } from "@/lib/proxy/company";
import { ArrowRightIcon, CompassIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "International Technical Partnerships",
  description:
    "Proxy Consultants Ltd has established strategic partnerships with experienced engineering professionals and subject matter experts from the Republic of Korea.",
};

export default function PartnershipsPage() {
  return (
    <PageShell
      eyebrow="International technical partnerships"
      title="Korean engineering expertise, delivered on call"
      subtitle="Proxy Consultants Ltd has established strategic partnerships with experienced engineering professionals and subject matter experts from the Republic of Korea, providing our clients with access to internationally recognised expertise in transport infrastructure development."
      breadcrumbs={[{ label: "International Technical Partnerships" }]}
    >
      <PageSection
        eyebrow="On-call expertise"
        title="Decades of expressway and bridge experience"
        description="Our on-call Korean experts have extensive experience in the planning, design, construction, operation and maintenance of expressways and bridges, as well as infrastructure asset management systems. Through this collaboration, we deliver technically sound, innovative and sustainable solutions that are aligned with global engineering best practices while addressing Uganda's unique infrastructure needs."
      >
        <div className="rounded-imme border border-imme-line bg-white p-6 shadow-imme-card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="text-lg">🇰🇷</span>
            <span aria-hidden className="text-imme-muted">×</span>
            <span className="text-lg">🇺🇬</span>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-imme-muted">
              Korea–Uganda partnership
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-imme-muted">
            By combining local expertise with international technical support, Proxy Consultants Ltd is well
            positioned to deliver complex infrastructure projects to the highest professional standards.
          </p>
        </div>
      </PageSection>

      <PageSection
        variant="concrete"
        eyebrow="Specialised services"
        title="This partnership strengthens our ability to provide specialised services in"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERSHIP_SPECIALTIES.map((specialty) => (
            <li key={specialty} className="flex items-center gap-3 rounded-imme border border-imme-line bg-white p-5 shadow-imme-card">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-imme-navy/5 text-imme-navy">
                <CompassIcon className="h-4 w-4" />
              </span>
              <span className="font-display text-sm font-semibold text-imme-navy">{specialty}</span>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        variant="navy"
        eyebrow="See it in practice"
        title="This network delivered our expressway consultancy work"
        description="From the Uganda Design Manual review to the Expressway PPP Feasibility Review Guidelines, our Korean partnership underpinned every selected project."
      >
        <Link href="/projects" className="imme-btn-amber">
          View selected projects
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>
    </PageShell>
  );
}

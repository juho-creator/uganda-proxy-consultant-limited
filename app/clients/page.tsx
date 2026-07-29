import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { CLIENTS, INSTITUTIONAL_STAKEHOLDERS } from "@/lib/proxy/company";
import { ArrowRightIcon, CompassIcon, MapPinIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "Clients & Partners",
  description:
    "Proxy Consultants Ltd delivers value to governments, development partners, private sector organisations and international engineering firms throughout Uganda and the East African region.",
};

export default function ClientsPage() {
  return (
    <PageShell
      eyebrow="Clients & partners"
      title="Trusted by international engineering firms and government institutions"
      subtitle="We are committed to delivering value to governments, development partners, private sector organisations and international engineering firms throughout Uganda and the East African region."
      breadcrumbs={[{ label: "Clients & Partners" }]}
    >
      <PageSection eyebrow="Consultancy clients" title="Who commissions our work">
        <ul className="grid gap-5 sm:grid-cols-2">
          {CLIENTS.map((client) => (
            <li key={client.id} className="flex h-full flex-col gap-3 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-navy/5 text-imme-navy">
                <CompassIcon className="h-5 w-5" />
              </span>
              <p className="font-display text-lg font-bold text-imme-navy">{client.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-imme-amber">{client.country}</p>
              <p className="text-sm leading-6 text-imme-muted">{client.role}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        variant="concrete"
        eyebrow="Institutional stakeholders"
        title="Government and agency partners we work alongside"
        description="Stakeholder consultations and institutional coordination are central to how we deliver — every project engages Uganda's own transport institutions directly."
      >
        <ul className="grid gap-5 sm:grid-cols-2">
          {INSTITUTIONAL_STAKEHOLDERS.map((stakeholder) => (
            <li key={stakeholder.id} className="flex h-full flex-col gap-3 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-green/10 text-imme-green">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <p className="font-display text-lg font-bold text-imme-navy">{stakeholder.name}</p>
              <p className="text-sm leading-6 text-imme-muted">{stakeholder.role}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        variant="navy"
        eyebrow="International technical network"
        title="An on-call bench of Korean engineering specialists"
        description="Our partnership with the Republic of Korea's engineering professionals extends our client relationships with genuinely global technical depth."
      >
        <Link href="/partnerships" className="imme-btn-amber">
          See the partnership
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>
    </PageShell>
  );
}

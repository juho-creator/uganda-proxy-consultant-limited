import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { CORE_SERVICES } from "@/lib/proxy/company";
import {
  ArrowRightIcon,
  BookStackIcon,
  BridgeIcon,
  CapIcon,
  CompassIcon,
  GearIcon,
  GridIcon,
  MagnifierIcon,
  MapPinIcon,
  PeopleIcon,
  SearchSparkIcon,
  ToolboxIcon,
} from "@/components/imme/imme-icons";

export const metadata = {
  title: "Our Services",
  description:
    "Professional consultancy services in transport planning, engineering design, operations and maintenance, bridge management systems, asset management, project management, infrastructure advisory, and website and software development.",
};

const SERVICE_ICONS: Record<string, typeof BookStackIcon> = {
  "transport-planning": CompassIcon,
  "highway-expressway-design": MapPinIcon,
  "bridge-bms": BridgeIcon,
  "om-systems": GearIcon,
  "asset-management": ToolboxIcon,
  "project-management": BookStackIcon,
  "design-reviews": MagnifierIcon,
  "feasibility-studies": SearchSparkIcon,
  "ppp-advisory": CapIcon,
  "standards-manuals": BookStackIcon,
  "stakeholder-engagement": PeopleIcon,
  gis: GridIcon,
  "website-design": GridIcon,
  "custom-software": GearIcon,
};

export default function ServicesPage() {
  return (
    <PageShell
      eyebrow="Our services"
      title="Fourteen consultancy disciplines, one delivery team."
      subtitle="We offer professional consultancy services in transport planning, engineering design, operations and maintenance (O&M), bridge management systems, asset management, project management, infrastructure advisory, and website and software development."
      breadcrumbs={[{ label: "Our Services" }]}
    >
      <PageSection eyebrow="Core services" title="What we deliver">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.id] ?? BookStackIcon;
            return (
              <li key={service.id} className="flex h-full flex-col gap-3 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-navy/5 text-imme-navy">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-bold leading-snug text-imme-navy">{service.title}</h3>
                <p className="text-sm leading-6 text-imme-muted">{service.blurb}</p>
              </li>
            );
          })}
        </ul>
      </PageSection>

      <PageSection
        variant="navy"
        eyebrow="Need a specific service?"
        title="Talk to us about your infrastructure or digital project"
        description="Whether it's a feasibility study, a bridge management system, or a custom software platform — our team and our Korean technical partner network can scope it with you."
      >
        <Link href="/contact" className="imme-btn-amber">
          Contact Us
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>
    </PageShell>
  );
}

import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { TEAM_GROUPS } from "@/lib/proxy/company";
import { ArrowRightIcon, PeopleIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "Our Team",
  description:
    "The Proxy Consultants Ltd team combines a Uganda-based engineering and consultancy practice with an on-call network of Korean technical specialists.",
};

export default function TeamPage() {
  return (
    <PageShell
      eyebrow="Our team"
      title="Local delivery, backed by an international bench"
      subtitle="Proxy Consultants Ltd combines a Uganda-based engineering and consultancy practice with an on-call network of highly experienced engineering specialists from the Republic of Korea."
      breadcrumbs={[{ label: "Our Team" }]}
    >
      <PageSection eyebrow="How we're organised" title="Three teams, one delivery model">
        <ul className="grid gap-6 lg:grid-cols-3">
          {TEAM_GROUPS.map((group) => (
            <li key={group.id} className="flex h-full flex-col gap-4 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-imme-navy/5 text-imme-navy">
                <PeopleIcon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-imme-navy">{group.title}</h3>
              <p className="text-sm leading-6 text-imme-muted">{group.description}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {group.areas.map((area) => (
                  <li key={area} className="rounded-full border border-imme-line bg-imme-concrete px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-imme-navy">
                    {area}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        variant="navy"
        eyebrow="Join the network"
        title="Interested in working with Proxy Consultants Ltd?"
        description="We're always open to connecting with engineering professionals, government institutions, and development partners who share our commitment to professionalism, integrity, innovation and technical excellence."
      >
        <Link href="/contact" className="imme-btn-amber">
          Get in touch
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>
    </PageShell>
  );
}

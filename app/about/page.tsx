import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { COMPANY, EXPERTISE_AREAS } from "@/lib/proxy/company";
import { ArrowRightIcon, CheckCircleIcon, CompassIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "About Us",
  description:
    "Proxy Consultants Ltd is a Ugandan engineering consultancy providing innovative, sustainable and high-quality solutions in transport infrastructure and digital technologies.",
};

export default function AboutPage() {
  const [intro, experienceParagraph, partnershipParagraph, digitalParagraph, closingParagraph] = COMPANY.about;

  return (
    <PageShell
      eyebrow="About us"
      title="Engineering Uganda's infrastructure. Building its digital future."
      subtitle={COMPANY.summary}
      breadcrumbs={[{ label: "About Us" }]}
      intro={
        <div className="flex flex-wrap gap-3">
          <Link href="#who-we-are" className="imme-pill border-imme-navy/20 bg-white text-imme-navy hover:bg-imme-concrete">
            Who We Are
          </Link>
          <Link href="#experience" className="imme-pill border-imme-navy/20 bg-white text-imme-navy hover:bg-imme-concrete">
            Our Experience
          </Link>
          <Link href="#partnership" className="imme-pill border-imme-navy/20 bg-white text-imme-navy hover:bg-imme-concrete">
            Korean Partnership
          </Link>
          <Link href="#values" className="imme-pill border-imme-navy/20 bg-white text-imme-navy hover:bg-imme-concrete">
            Our Values
          </Link>
        </div>
      }
    >
      {/* Who we are */}
      <PageSection id="who-we-are" eyebrow="Who we are" title="A Ugandan engineering consultancy" description={intro}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-4 text-[15px] leading-7 text-imme-ink imme-prose">
            <p>{experienceParagraph}</p>
            <p>{digitalParagraph}</p>
          </div>
          <aside className="rounded-imme border border-imme-line bg-imme-concrete p-5">
            <p className="imme-eyebrow">What we offer</p>
            <p className="mt-3 text-sm leading-6 text-imme-muted">
              Professional consultancy services in transport planning, engineering design, operations and
              maintenance (O&amp;M), bridge management systems, asset management, project management,
              infrastructure advisory, and website and software development.
            </p>
            <Link href="/services" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber">
              See our core services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </PageSection>

      {/* Experience */}
      <PageSection
        id="experience"
        variant="concrete"
        eyebrow="Our experience"
        title="Nationally significant infrastructure projects"
        description="Our experience spans nationally significant infrastructure projects, where we have successfully partnered with international engineering firms and government institutions to develop engineering manuals, operations and maintenance systems, design standards, bridge management frameworks, and Public-Private Partnership (PPP) guidelines for Uganda's expressway network."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE_AREAS.map((area) => (
            <li key={area} className="flex items-start gap-3 rounded-imme border border-imme-line bg-white p-4 shadow-imme-card">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-imme-green" />
              <span className="text-sm leading-6 text-imme-ink">{area}</span>
            </li>
          ))}
        </ul>
        <Link href="/experience" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber">
          Full experience record
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </PageSection>

      {/* Korean partnership */}
      <PageSection
        id="partnership"
        eyebrow="A key strength"
        title="Collaboration with Korea's engineering specialists"
        description={partnershipParagraph}
      >
        <div className="rounded-imme border border-imme-line bg-white p-6 shadow-imme-card sm:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-imme-navy/5 text-imme-navy">
              <CompassIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-imme-navy">On-call Korean technical specialist network</p>
              <p className="mt-2 text-sm leading-6 text-imme-muted">
                International expertise in transport planning, expressway engineering, bridge management systems,
                operations and maintenance, asset management, infrastructure planning and capacity building — combining
                international best practice with local knowledge.
              </p>
            </div>
          </div>
          <Link href="/partnerships" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber">
            International technical partnerships
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </PageSection>

      {/* Values */}
      <PageSection
        id="values"
        variant="navy"
        eyebrow="What drives us"
        title="Professionalism, integrity, innovation and technical excellence"
        description={closingParagraph}
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANY.values.map((value) => (
            <li key={value} className="rounded-imme border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm">
              <p className="font-display text-xl font-bold text-white">{value}</p>
            </li>
          ))}
        </ul>
      </PageSection>
    </PageShell>
  );
}

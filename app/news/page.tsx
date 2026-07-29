import Link from "next/link";
import { PageSection, PageShell } from "@/components/imme/page-shell";
import { INSIGHT_TOPICS } from "@/lib/proxy/company";
import { ArrowRightIcon, ClockIcon, SearchSparkIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "News & Insights",
  description: "Updates and technical insights from Proxy Consultants Ltd on Uganda's transport infrastructure and digital technology sector.",
};

export default function NewsPage() {
  return (
    <PageShell
      eyebrow="News & insights"
      title="Perspectives from Uganda's infrastructure and digital sector"
      subtitle="We'll publish project updates, technical notes and sector insights here as they become available."
      breadcrumbs={[{ label: "News & Insights" }]}
    >
      <PageSection eyebrow="Coming soon" title="What we'll be covering">
        <div className="rounded-imme border border-imme-line bg-white p-6 shadow-imme-card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-amber/10 text-imme-amber">
              <ClockIcon className="h-5 w-5" />
            </span>
            <p className="font-display text-base font-bold text-imme-navy">No articles published yet</p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-imme-muted">
            This page will host updates from our project teams and technical insights from our engineering and
            digital practice. In the meantime, browse the focus areas below or get in touch to be notified when
            we publish.
          </p>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber">
            Get in touch
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </PageSection>

      <PageSection variant="concrete" eyebrow="Focus areas" title="Topics on our editorial roadmap">
        <ul className="grid gap-5 sm:grid-cols-2">
          {INSIGHT_TOPICS.map((topic) => (
            <li key={topic.id} className="flex h-full flex-col gap-3 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-navy/5 text-imme-navy">
                <SearchSparkIcon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-base font-bold text-imme-navy">{topic.title}</h3>
              <p className="text-sm leading-6 text-imme-muted">{topic.description}</p>
            </li>
          ))}
        </ul>
      </PageSection>
    </PageShell>
  );
}

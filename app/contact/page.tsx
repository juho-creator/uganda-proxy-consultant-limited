import { PageSection, PageShell } from "@/components/imme/page-shell";
import { COMPANY } from "@/lib/proxy/company";
import { ContactForm } from "@/components/proxy/contact-form";
import { MailIcon, MapPinIcon } from "@/components/imme/imme-icons";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Proxy Consultants Ltd for transport infrastructure and digital technology consultancy services.",
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact us"
      title="Let's talk about your project."
      subtitle="Whether it's an engineering consultancy, a bridge management system, or a digital platform — reach out and our team will follow up."
      breadcrumbs={[{ label: "Contact Us" }]}
    >
      <PageSection eyebrow="Direct" title="Reach us directly">
        <ul className="grid gap-5 sm:grid-cols-2">
          <li className="flex h-full flex-col gap-3 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-navy text-white">
              <MailIcon className="h-5 w-5" />
            </span>
            <p className="font-display text-base font-semibold text-imme-navy">Email</p>
            <a href={`mailto:${COMPANY.email}`} className="break-words font-mono text-sm text-imme-ink underline decoration-imme-line hover:text-imme-navy">
              {COMPANY.email}
            </a>
          </li>
          <li className="flex h-full flex-col gap-3 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-navy text-white">
              <MapPinIcon className="h-5 w-5" />
            </span>
            <p className="font-display text-base font-semibold text-imme-navy">Location</p>
            <p className="text-sm text-imme-ink">{COMPANY.location}</p>
          </li>
        </ul>
      </PageSection>

      <PageSection variant="concrete" eyebrow="Send a message" title="Tell us about your project">
        <ContactForm />
      </PageSection>
    </PageShell>
  );
}

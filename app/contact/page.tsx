import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { COMPANY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Proxy Consultants Ltd for transport infrastructure and digital technology consultancy.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-8">
                <div className="border border-ink-100 bg-ink-50 p-8">
                  <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-600">Office</p>
                  <dl className="mt-4 space-y-4 text-sm text-ink-700">
                    <div>
                      <dt className="font-medium text-ink-900">Address</dt>
                      <dd className="mt-1">
                        {COMPANY.address}
                        <span className="mt-0.5 block text-xs text-ink-400">{COMPANY.addressNote}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink-900">Email</dt>
                      <dd className="mt-1">
                        <a href={`mailto:${COMPANY.email}`} className="hover:text-clay-600">
                          {COMPANY.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink-900">Phone</dt>
                      <dd className="mt-1">
                        <a href={`tel:${COMPANY.phone.replace(/\s+/g, "")}`} className="hover:text-clay-600">
                          {COMPANY.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

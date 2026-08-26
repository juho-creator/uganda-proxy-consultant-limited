import { Container } from "./container";
import { RouteMotif } from "./route-motif";
import { COMPANY } from "@/lib/content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-800 bg-ink-950 text-ink-200">
      <RouteMotif
        variant="panel"
        className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 text-ink-700 lg:h-[28rem] lg:w-[28rem]"
      />
      <Container className="relative py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-400">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
            <li>{COMPANY.address}</li>
            <li>{COMPANY.addressNote}</li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-white">
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={`tel:${COMPANY.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-white">
                {COMPANY.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-800 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {COMPANY.name}. All rights reserved.
          </p>
          <p>Engineering Uganda&rsquo;s infrastructure. Building its digital future.</p>
        </div>
      </Container>
    </footer>
  );
}

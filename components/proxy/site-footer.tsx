import Link from "next/link";
import { COMPANY, PROXY_NAV } from "@/lib/proxy/company";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-imme-navy-700/30 bg-imme-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(200,129,58,0.28), transparent 42%), radial-gradient(circle at 88% 10%, rgba(46,125,82,0.22), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
        }}
      />
      <div className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-imme-green via-imme-amber to-imme-navy-300 opacity-90" aria-hidden />

        <div className="imme-container-wide grid gap-12 py-14 lg:grid-cols-[1.15fr_1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-display font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-imme-amber-300">
                {COMPANY.name}
              </p>
              <h2 className="font-display text-[clamp(1.35rem,2.8vw,1.75rem)] font-bold leading-[1.2] tracking-tight">
                Transport infrastructure &amp; digital technology consultancy
              </h2>
              <p className="max-w-md text-[15px] leading-7 text-white/72">{COMPANY.tagline}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {COMPANY.values.map((value) => (
                <li key={value}>
                  <span className="inline-flex rounded-imme border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-white/88 backdrop-blur-sm transition hover:border-imme-amber/40 hover:bg-white/[0.1]">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer navigation" className="lg:border-x lg:border-white/10 lg:px-10">
            <p className="font-display font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-imme-amber-300">
              Navigate
            </p>
            <ul className="mt-5 grid gap-y-2 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-1">
              {PROXY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group inline-flex items-center gap-2 text-[14px] text-white/88 transition hover:text-white">
                    <span className="h-px w-0 bg-imme-amber transition-all duration-200 group-hover:w-4" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 rounded-imme border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm lg:p-7">
            <p className="font-display font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-imme-amber-300">
              Get in touch
            </p>
            <ul className="space-y-4 text-[14px] text-white/85">
              <li>
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Location</span>
                <span className="text-[13px]">{COMPANY.location}</span>
              </li>
              <li>
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Email</span>
                <a href={`mailto:${COMPANY.email}`} className="font-mono text-[13px] underline decoration-white/30 underline-offset-2 hover:text-imme-amber-300">
                  {COMPANY.email}
                </a>
              </li>
              <li className="pt-1">
                <Link href="/contact" className="imme-btn-amber inline-flex w-full justify-center sm:w-auto">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/15">
          <div className="imme-container-wide flex flex-col gap-3 py-6 text-[11px] uppercase tracking-[0.14em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl leading-relaxed">
              Serving governments, development partners, private sector organisations and international engineering firms throughout Uganda and the East African region.
            </p>
            <p className="font-mono normal-case tracking-normal text-white/40">
              © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import {
  CLIENTS,
  COMPANY,
  CORE_SERVICES,
  EXPERTISE_AREAS,
  SELECTED_PROJECTS,
} from "@/lib/proxy/company";
import {
  ArrowRightIcon,
  BookStackIcon,
  BridgeIcon,
  CheckCircleIcon,
  CompassIcon,
  GearIcon,
  GridIcon,
  ToolboxIcon,
} from "@/components/imme/imme-icons";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionRibbon />
      <ValuesBar />
      <SectionRibbon variant="light" />
      <ServicesPreview />
      <SectionRibbon />
      <AboutStrip />
      <SectionRibbon variant="light" />
      <ProjectsPreview />
      <SectionRibbon />
      <PartnershipStrip />
      <ClosingCta />
    </>
  );
}

/* ----------------------------------------------------------------- */
/* Hero                                                               */
/* ----------------------------------------------------------------- */

function Hero() {
  return (
    <section aria-labelledby="proxy-hero-title" className="relative overflow-hidden bg-imme-navy text-white">
      <HeroBackdrop />
      <div className="imme-container relative grid gap-12 py-16 sm:gap-14 sm:py-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:py-[5.25rem]">
        <div className="max-w-2xl">
          <p className="imme-eyebrow text-imme-amber-300">{COMPANY.name}</p>
          <h1
            id="proxy-hero-title"
            className="mt-4 font-display text-[clamp(1.85rem,4.6vw,3.15rem)] font-bold leading-[1.06] tracking-tight"
          >
            {COMPANY.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/82 sm:text-[17px] sm:leading-8">
            {COMPANY.summary}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/services" className="imme-btn-amber shadow-lg shadow-black/20">
              Explore Our Services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/[0.07] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-white/12"
            >
              View Selected Projects
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <TrustRibbon className="mt-10" />
        </div>

        <PartnerStrip />
      </div>
    </section>
  );
}

function TrustRibbon({ className = "" }: { className?: string }) {
  const labels = ["Transport Planning", "Bridge Engineering", "PPP Advisory", "GIS", "Software & Web"];
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-3 rounded-imme border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-sm",
        className,
      ].join(" ")}
    >
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Core practice</span>
      <span aria-hidden className="hidden h-4 w-px bg-white/15 sm:block" />
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {labels.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            {i > 0 ? <span className="text-white/25" aria-hidden>·</span> : null}
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-white/78">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionRibbon({ variant = "default" }: { variant?: "default" | "light" }) {
  const bg = variant === "light" ? "bg-imme-concrete" : "bg-white";
  return (
    <div aria-hidden className={["relative h-3 w-full overflow-hidden", bg].join(" ")}>
      <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-imme-amber/55 to-transparent sm:inset-x-16 lg:inset-x-24" />
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(200, 129, 58, 0.32), transparent 35%), radial-gradient(circle at 82% 30%, rgba(46, 125, 82, 0.28), transparent 40%), linear-gradient(135deg, #14213a 0%, #1a2d4f 55%, #22406e 100%)",
        }}
      />
      <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden>
        <path d="M0 200 L1200 90 L1200 240 L0 240 Z" fill="rgba(255,255,255,0.04)" />
        <path d="M0 220 L1200 130 L1200 240 L0 240 Z" fill="rgba(0,0,0,0.18)" />
        <path d="M-20 215 L380 165 L600 130 L1220 95" stroke="rgba(255,255,255,0.42)" strokeWidth="3" fill="none" strokeDasharray="14 14" />
        <path d="M-20 215 L380 165 L600 130 L1220 95" stroke="#C8813A" strokeWidth="1.4" fill="none" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-imme-navy via-transparent to-imme-navy/50" />
    </div>
  );
}

function PartnerStrip() {
  return (
    <aside
      aria-label="International technical partnership"
      className="grid gap-4 self-start rounded-imme border border-white/18 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 text-white shadow-imme-soft backdrop-blur-md sm:p-7"
    >
      <p className="imme-eyebrow text-imme-amber-300">International technical partnership</p>
      <p className="text-[15px] leading-7 text-white/76">
        A network of highly experienced engineering specialists from the Republic of Korea provides on-call
        technical support across expressway engineering, BMS, O&amp;M, and asset management.
      </p>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-2">
        {CLIENTS.map((client) => (
          <li key={client.id} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="font-display text-sm font-semibold tracking-wide text-white">{client.name}</p>
            <p className="text-[11px] uppercase tracking-wider text-white/55">{client.country}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5 text-[12px] text-white/80">
        <span aria-hidden className="text-base">🇰🇷 🇺🇬</span>
        <span className="font-mono uppercase tracking-wider">Korea–Uganda partnership</span>
      </div>
    </aside>
  );
}

/* ----------------------------------------------------------------- */
/* Values bar                                                         */
/* ----------------------------------------------------------------- */

function ValuesBar() {
  return (
    <section aria-label="What drives us" className="relative bg-imme-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "linear-gradient(115deg, rgba(26,45,79,0.5) 0%, transparent 55%)" }}
      />
      <div className="imme-container-wide relative grid gap-8 py-11 sm:grid-cols-2 sm:gap-y-10 sm:py-14 lg:grid-cols-4 lg:gap-6">
        {COMPANY.values.map((value, idx) => (
          <div
            key={value}
            className={["relative flex flex-col gap-2 pl-4 sm:pl-5", idx > 0 ? "lg:border-l lg:border-white/12 lg:pl-8" : ""].join(" ")}
          >
            <span aria-hidden className="absolute left-0 top-2 hidden h-[calc(100%-0.5rem)] w-1 rounded-full bg-imme-amber/85 lg:block" />
            <p className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-none tracking-tight">{value}</p>
            <p className="max-w-[14rem] text-[11px] font-medium uppercase leading-snug tracking-[0.14em] text-white/62">
              Driving every engagement we deliver
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Services preview                                                   */
/* ----------------------------------------------------------------- */

function ServicesPreview() {
  const featured: Array<{ icon: typeof BookStackIcon; title: string; body: string; tone: "navy" | "amber" | "green" }> = [
    {
      icon: BridgeIcon,
      title: "Bridge Engineering & BMS",
      body: "Bridge engineering consultancy paired with digital Bridge Management Systems for inspection and maintenance planning.",
      tone: "navy",
    },
    {
      icon: CompassIcon,
      title: "Transport Planning & Design",
      body: "Transport planning, highway and expressway engineering design calibrated to expressway-grade standards.",
      tone: "amber",
    },
    {
      icon: GearIcon,
      title: "O&M & Asset Management",
      body: "Operations & maintenance systems and infrastructure asset management frameworks across the asset lifecycle.",
      tone: "green",
    },
    {
      icon: GridIcon,
      title: "Digital & Software Solutions",
      body: "Website design, GIS, custom software and digital platforms supporting infrastructure and institutions.",
      tone: "navy",
    },
  ];

  const toneStyles: Record<(typeof featured)[number]["tone"], { iconBg: string; iconColor: string }> = {
    navy: { iconBg: "bg-imme-navy", iconColor: "text-white" },
    amber: { iconBg: "bg-imme-amber", iconColor: "text-white" },
    green: { iconBg: "bg-imme-green", iconColor: "text-white" },
  };

  return (
    <section aria-labelledby="services-preview" className="bg-white">
      <div className="imme-container py-14 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="imme-eyebrow">Our core services</p>
            <h2 id="services-preview" className="imme-h2 mt-2 max-w-2xl">
              {CORE_SERVICES.length} consultancy disciplines, one delivery team.
            </h2>
            <p className="mt-3 max-w-2xl text-imme-muted">
              From transport planning through to custom software, we cover the full lifecycle of infrastructure
              and digital delivery.
            </p>
          </div>
          <Link href="/services" className="imme-btn-secondary self-start lg:self-end">
            All services
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((card) => {
            const Icon = card.icon;
            const tone = toneStyles[card.tone];
            return (
              <div key={card.title} className="group flex h-full flex-col rounded-imme border border-imme-line bg-white p-6 shadow-imme-card transition hover:-translate-y-0.5 hover:border-imme-navy hover:shadow-imme-soft">
                <span className={["inline-flex h-12 w-12 items-center justify-center rounded-xl", tone.iconBg, tone.iconColor].join(" ")}>
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-imme-navy">{card.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-imme-muted">{card.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* About strip                                                        */
/* ----------------------------------------------------------------- */

function AboutStrip() {
  return (
    <section aria-labelledby="about-strip" className="bg-imme-concrete">
      <div className="imme-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <p className="imme-eyebrow">Who we are</p>
          <h2 id="about-strip" className="imme-h2 mt-2 max-w-xl">
            A Ugandan engineering consultancy with an international technical bench.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-imme-muted">{COMPANY.about[0]}</p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber">
            More about Proxy Consultants
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {EXPERTISE_AREAS.slice(0, 6).map((area) => (
            <li key={area} className="flex items-start gap-3 rounded-imme border border-imme-line bg-white p-4 shadow-imme-card">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-imme-green" />
              <span className="text-sm leading-6 text-imme-ink">{area}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Projects preview                                                   */
/* ----------------------------------------------------------------- */

function ProjectsPreview() {
  return (
    <section aria-labelledby="projects-preview" className="bg-white">
      <div className="imme-container py-14 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="imme-eyebrow">Selected projects</p>
            <h2 id="projects-preview" className="imme-h2 mt-2 max-w-2xl">
              Nationally significant expressway consultancy work
            </h2>
          </div>
          <Link href="/projects" className="imme-btn-secondary self-start lg:self-end">
            All projects
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {SELECTED_PROJECTS.map((project) => (
            <article key={project.id} className="flex h-full flex-col rounded-imme border border-imme-line bg-white p-6 shadow-imme-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-imme-navy/[0.06] text-imme-navy">
                <ToolboxIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold leading-snug text-imme-navy">{project.title}</h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-imme-amber">
                Client — {project.client}, {project.clientCountry}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Partnership strip                                                  */
/* ----------------------------------------------------------------- */

function PartnershipStrip() {
  return (
    <section aria-labelledby="partnership-strip" className="bg-imme-concrete">
      <div className="imme-container flex flex-col gap-8 py-14 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="imme-eyebrow">International technical partnerships</p>
          <h2 id="partnership-strip" className="imme-h2 mt-2">
            Korean engineering expertise, on call.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-imme-muted">
            Our on-call Korean experts have extensive experience in the planning, design, construction, operation
            and maintenance of expressways and bridges, as well as infrastructure asset management systems.
          </p>
        </div>
        <Link href="/partnerships" className="imme-btn-primary self-start lg:self-auto">
          Explore the partnership
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Closing CTA                                                        */
/* ----------------------------------------------------------------- */

function ClosingCta() {
  return (
    <section aria-label="Get in touch" className="bg-imme-navy text-white">
      <div className="imme-container flex flex-col gap-6 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="imme-eyebrow text-imme-amber-300">Let&apos;s build something durable</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Practical engineering and digital solutions for Uganda&apos;s infrastructure sector.
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/team" className="imme-btn-amber">
            Meet the team
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
          >
            Contact us
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

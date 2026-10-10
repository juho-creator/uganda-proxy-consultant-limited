/**
 * Single source of truth for Proxy Consultants Ltd site copy. Every page imports from here so a
 * single edit propagates across the whole site. Facts are sourced from the company brief; contact
 * details are placeholders pending real details from the client.
 */

export const COMPANY = {
  name: "Proxy Consultants Ltd",
  shortName: "Proxy Consultants",
  tagline: "Transport infrastructure and digital technology consultancy, engineered for Uganda and East Africa.",
  summary:
    "A Ugandan engineering consultancy providing innovative, sustainable and high-quality solutions in transport infrastructure and digital technologies.",
  email: "proxyconsultantsltd@gmail.com",
  phone: "+256 779 002985",
  address: "Plot 1402, Nabe Road, Kiwatule, Kampala, Uganda",
  addressNote: "P.O. Box 112305, Nakawa, Kampala",
} as const;

export type NavLeaf = { label: string; href: string; description?: string };
export type NavLink = { label: string; href: string; children?: undefined };
export type NavGroup = { label: string; href?: undefined; children: NavLeaf[] };
export type NavEntry = NavLink | NavGroup;

/**
 * Three top-level nav entries, each a dropdown group. "Home" isn't listed separately — the
 * logo/wordmark in the header already links to "/". "News & Insights" and "Contact Us" live
 * under "About Us" alongside the rest of the company-facing pages.
 */
export const NAV_ITEMS: NavEntry[] = [
  {
    label: "About Us",
    children: [
      { label: "Who We Are", href: "/about", description: "Our story, values and approach." },
      { label: "Our Team", href: "/team", description: "Meet our engineering and technical team." },
      {
        label: "International Technical Partnerships",
        href: "/partnerships",
        description: "Our on-call network of Korean engineering specialists.",
      },
      { label: "News & Insights", href: "/news", description: "Updates, technical insights and project news." },
      { label: "Contact Us", href: "/contact", description: "Get in touch with our team." },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Our Services", href: "/services", description: "The full range of engineering and digital services we offer." },
      { label: "Our Experience", href: "/experience", description: "Where we have applied that expertise." },
    ],
  },
  {
    label: "Projects",
    children: [
      { label: "Selected Projects", href: "/projects", description: "Case studies from our consultancy assignments." },
      { label: "Clients & Partners", href: "/clients", description: "The institutions and firms we work with." },
    ],
  },
];

/**
 * Flat list of every page, used by the footer and sitemap. Home is prepended explicitly since
 * it's no longer a nav entry (it's reachable via the logo) but still needs a sitemap/footer entry.
 */
export const ALL_PAGES: NavLeaf[] = [
  { label: "Home", href: "/" },
  ...NAV_ITEMS.flatMap((item) => (item.children ? item.children : [{ label: item.label, href: item.href }])),
];

export const ABOUT_PARAGRAPHS = [
  "Proxy Consultants Ltd is a Ugandan engineering consultancy providing innovative, sustainable and high-quality solutions in transport infrastructure and digital technologies. We offer professional consultancy services in transport planning, engineering design, operations and maintenance (O&M), bridge management systems, asset management, project management, infrastructure advisory, and website and software development.",
  "Our experience spans nationally significant infrastructure projects, where we have partnered with international engineering firms and government institutions to develop engineering manuals, operations and maintenance systems, design standards, bridge management frameworks, and Public-Private Partnership (PPP) guidelines for Uganda's expressway network.",
  "A key strength of Proxy Consultants Ltd is our collaboration with a network of experienced engineering specialists from the Republic of Korea, who provide on-call technical support in transport planning, expressway engineering, bridge management systems, operations and maintenance, asset management, infrastructure planning and capacity building. This partnership combines international best practice with local knowledge.",
  "Beyond engineering consultancy, Proxy Consultants Ltd develops websites, digital platforms and custom software solutions that support infrastructure management, institutional operations and business growth.",
  "We are guided by professionalism, integrity, innovation and technical excellence, and are committed to delivering value to governments, development partners, private sector organizations and international engineering firms across Uganda and East Africa.",
] as const;

export const VALUES = [
  {
    title: "Professionalism",
    description: "Disciplined, well-documented work that meets the standards government and international partners expect.",
  },
  {
    title: "Integrity",
    description: "Independent, honest technical judgment, even when it is not the easiest answer.",
  },
  {
    title: "Innovation",
    description: "Practical use of digital tools and current engineering practice to improve infrastructure outcomes.",
  },
  {
    title: "Technical Excellence",
    description: "Engineering rigor drawn from local experience and internationally recognized expertise.",
  },
] as const;

export type Service = {
  id: string;
  title: string;
  blurb: string;
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "transport-planning",
    title: "Transport Planning",
    blurb: "Strategic planning for road and expressway networks that anticipates demand and guides sustainable investment.",
    featured: true,
  },
  {
    id: "highway-expressway-design",
    title: "Highway and Expressway Engineering Design",
    blurb: "Geometric, pavement and structural design services calibrated to expressway-grade standards.",
    featured: true,
  },
  {
    id: "bridge-bms",
    title: "Bridge Engineering and Bridge Management Systems (BMS)",
    blurb: "Bridge engineering consultancy paired with digital BMS tools for inspection and maintenance planning.",
    featured: true,
  },
  {
    id: "om-systems",
    title: "Operations & Maintenance (O&M) Systems",
    blurb: "O&M manuals and systems that keep infrastructure assets performing across their full service life.",
    featured: true,
  },
  {
    id: "asset-management",
    title: "Infrastructure Asset Management",
    blurb: "Frameworks that track condition, prioritize investment and extend the service life of public assets.",
    featured: true,
  },
  {
    id: "project-management",
    title: "Project Management Consultancy",
    blurb: "End-to-end project management support for nationally significant infrastructure programs.",
    featured: true,
  },
  {
    id: "design-reviews",
    title: "Engineering Design Reviews and Technical Audits",
    blurb: "Independent technical review of designs and standards to safeguard quality and compliance.",
  },
  {
    id: "feasibility-studies",
    title: "Feasibility Studies and Infrastructure Planning",
    blurb: "Rigorous feasibility assessments that de-risk infrastructure investment decisions.",
  },
  {
    id: "ppp-advisory",
    title: "Public-Private Partnership (PPP) Advisory Services",
    blurb: "PPP guideline development and feasibility review advisory for expressway and infrastructure programs.",
  },
  {
    id: "standards-manuals",
    title: "Engineering Standards and Manual Development",
    blurb: "Development and localization of engineering manuals and design standards for Uganda's context.",
  },
  {
    id: "stakeholder-engagement",
    title: "Stakeholder Engagement and Capacity Building",
    blurb: "Structured engagement with ministries, agencies and partners, paired with technical capacity building.",
  },
  {
    id: "gis",
    title: "Geographic Information Systems (GIS)",
    blurb: "Spatial data and mapping support for infrastructure planning, condition surveys and asset records.",
  },
  {
    id: "web-design",
    title: "Website Design and Development",
    blurb: "Modern, professional websites for institutions and businesses, built for clarity and performance.",
  },
  {
    id: "custom-software",
    title: "Custom Software and Digital Solutions",
    blurb: "Bespoke software and digital platforms that support infrastructure management and business operations.",
  },
];

export const FEATURED_SERVICES = SERVICES.filter((s) => s.featured);

export const EXPERIENCE_AREAS = [
  "Transport planning and infrastructure advisory services",
  "Development of expressway operations and maintenance manuals",
  "Highway, bridge and pavement engineering consultancy",
  "Project management and technical advisory services",
  "Bridge Management System (BMS) development and implementation support",
  "Engineering design reviews and standards development",
  "Infrastructure policy development and PPP guideline preparation",
  "Stakeholder consultations and institutional coordination",
  "Technical report preparation and engineering research",
  "Localization of international engineering manuals and best practices",
  "Pavement, bridge and drainage infrastructure assessments",
  "Capacity building and technical support for transport sector institutions",
  "Development of digital platforms, websites and customized software solutions",
] as const;

export type Project = {
  id: string;
  title: string;
  client: string;
  highlights: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "integrated-manual-facility-management",
    title:
      "Project Management Consultancy Services for the Establishment of an Integrated Manual and Main Facility Management System of Expressways in Uganda",
    client: "Dohwa Engineering Co. Ltd (Republic of Korea)",
    highlights: [
      "Development of integrated operations and maintenance manuals",
      "Stakeholder consultations with the Ministry of Works and Transport (MoWT), UNRA and other agencies",
      "Technical investigations, engineering research and project reporting",
      "Support for pavement, bridge, drainage and asset management systems",
    ],
  },
  {
    id: "uganda-design-manual-review",
    title: "Consultancy Services for the Review of the Uganda Design Manual and Collection of African Design Manuals",
    client: "Dohwa Engineering Co. Ltd (Republic of Korea)",
    highlights: [
      "Review of Uganda's highway design standards",
      "Comparative assessment of African highway design manuals",
      "Preparation of draft and final technical review reports",
    ],
  },
  {
    id: "om-manual-localization",
    title: "Consultancy Services for the Localization Review for the Development of Uganda Expressways Operations & Maintenance Manual",
    client: "Korea Expressway Corporation (Republic of Korea)",
    highlights: [
      "Localization of Uganda's Expressway O&M Manual",
      "Review of manuals covering pavements, bridges, tunnels, drainage, traffic management and disaster management",
      "Technical editing and adaptation to Ugandan conditions",
    ],
  },
  {
    id: "ppp-feasibility-guidelines",
    title: "Consultancy Services for the Development of Uganda Expressways Public-Private Partnership (PPP) Feasibility Review Guidelines",
    client: "Korea Expressway Corporation (Republic of Korea)",
    highlights: [
      "Stakeholder consultations with the Ministry of Works and Transport",
      "Review of Uganda's PPP legislation, transport policies and international best practices",
      "Comparative studies of local and international PPP models",
      "Preparation and submission of the Draft and Final Uganda Expressway PPP Feasibility Review Guidelines",
    ],
  },
];

export const PARTNERSHIP_SERVICE_AREAS = [
  "Transport Planning",
  "Highway and Expressway Design",
  "Bridge Engineering",
  "Bridge Management Systems (BMS)",
  "Pavement Management Systems (PMS)",
  "Tunnel Engineering",
  "Operations & Maintenance (O&M) Systems",
  "Infrastructure Asset Management",
  "Feasibility Studies",
  "Technical Reviews and Capacity Building",
  "Engineering Research and Standards Development",
] as const;

export type Client = {
  name: string;
  location: string;
  logo: string;
  website: string;
};

export const CLIENTS: Client[] = [
  {
    name: "Dohwa Engineering Co. Ltd",
    location: "Republic of Korea",
    logo: "/dohwa-logo.png",
    website: "https://www.dohwa.co.kr",
  },
  {
    name: "Korea Expressway Corporation",
    location: "Republic of Korea",
    logo: "/kec-logo.png",
    website: "https://www.ex.co.kr",
  },
  {
    name: "CHEIL Engineering",
    location: "Republic of Korea",
    logo: "/cheil-logo.png",
    website: "http://www.cheileng.com/",
  },
  {
    name: "Ministry of Works and Transport (MoWT)",
    location: "Uganda",
    logo: "/mowt_logo.png",
    website: "https://works.go.ug/",
  },
  {
    name: "Uganda National Roads Authority (UNRA)",
    location: "Uganda",
    logo: "/unra-logo.png",
    website: "https://www.unra.go.ug/",
  },
];

export const SECTORS_SERVED = [
  "Government institutions",
  "Development partners",
  "Private sector organizations",
  "International engineering firms",
] as const;

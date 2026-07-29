/**
 * Single source of truth for Proxy Consultants Ltd content (facts, services, projects,
 * partnerships, navigation). Update this file rather than hard-coding copy inside individual
 * page components — every public page imports from here so a single edit propagates across the
 * whole site. Content is sourced from "ABOUT PROXY CONSULTANTS LTD".
 */

export const COMPANY = {
  name: "Proxy Consultants Ltd",
  shortName: "Proxy Consultants",
  tagline: "Engineering Uganda's infrastructure. Building its digital future.",
  summary:
    "A Ugandan engineering consultancy providing innovative, sustainable and high-quality solutions in transport infrastructure and digital technologies.",
  about: [
    "Proxy Consultants Ltd is a Ugandan engineering consultancy providing innovative, sustainable and high-quality solutions in transport infrastructure and digital technologies. We offer professional consultancy services in transport planning, engineering design, operations and maintenance (O&M), bridge management systems, asset management, project management, infrastructure advisory, and website and software development.",
    "Our experience spans nationally significant infrastructure projects, where we have successfully partnered with international engineering firms and government institutions to develop engineering manuals, operations and maintenance systems, design standards, bridge management frameworks, and Public-Private Partnership (PPP) guidelines for Uganda's expressway network.",
    "A key strength of Proxy Consultants Ltd is our collaboration with a network of highly experienced engineering specialists from the Republic of Korea, who provide on-call technical support and international expertise in transport planning, expressway engineering, bridge management systems, operations and maintenance, asset management, infrastructure planning and capacity building. This partnership enables us to combine international best practices with local knowledge to deliver practical, innovative and sustainable engineering solutions.",
    "Beyond engineering consultancy, Proxy Consultants Ltd develops modern websites, digital platforms and customised software solutions that support infrastructure management, institutional operations and business growth.",
    "Driven by professionalism, integrity, innovation and technical excellence, we are committed to delivering value to governments, development partners, private sector organisations and international engineering firms throughout Uganda and the East African region.",
  ],
  values: ["Professionalism", "Integrity", "Innovation", "Technical Excellence"],
  location: "Kampala, Uganda",
  email: "proxyconsultantsltd@gmail.com",
} as const;

/** OUR CORE SERVICES */
export const CORE_SERVICES: ReadonlyArray<{ id: string; title: string; blurb: string }> = [
  {
    id: "transport-planning",
    title: "Transport Planning",
    blurb: "Strategic planning for road and expressway networks that anticipate demand and guide sustainable investment.",
  },
  {
    id: "highway-expressway-design",
    title: "Highway and Expressway Engineering Design",
    blurb: "Geometric, pavement, and structural design services calibrated to expressway-grade standards.",
  },
  {
    id: "bridge-bms",
    title: "Bridge Engineering and Bridge Management Systems (BMS)",
    blurb: "Bridge engineering consultancy paired with digital BMS tools for inspection and maintenance planning.",
  },
  {
    id: "om-systems",
    title: "Operations & Maintenance (O&M) Systems",
    blurb: "O&M manuals and systems that keep infrastructure assets performing across their full lifecycle.",
  },
  {
    id: "asset-management",
    title: "Infrastructure Asset Management",
    blurb: "Frameworks that track condition, prioritise investment, and extend the service life of public assets.",
  },
  {
    id: "project-management",
    title: "Project Management Consultancy",
    blurb: "End-to-end project management support for nationally significant infrastructure programmes.",
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
    blurb: "PPP guideline development and feasibility review advisory for expressway and infrastructure programmes.",
  },
  {
    id: "standards-manuals",
    title: "Engineering Standards and Manual Development",
    blurb: "Localisation and development of engineering manuals and design standards for Uganda's context.",
  },
  {
    id: "stakeholder-engagement",
    title: "Stakeholder Engagement and Capacity Building",
    blurb: "Consultations and technical capacity building for government and institutional partners.",
  },
  {
    id: "gis",
    title: "Geographic Information Systems (GIS)",
    blurb: "Spatial data and GIS-driven insight to support infrastructure planning and asset management.",
  },
  {
    id: "website-design",
    title: "Website Design and Development",
    blurb: "Modern, institution-grade websites built to represent organisations and serve their users well.",
  },
  {
    id: "custom-software",
    title: "Custom Software and Digital Solutions",
    blurb: "Bespoke software and digital platforms supporting infrastructure management and business growth.",
  },
];

/** OUR EXPERIENCE — expertise bullet list */
export const EXPERTISE_AREAS: ReadonlyArray<string> = [
  "Transport planning and infrastructure advisory services.",
  "Development of expressway operations and maintenance manuals.",
  "Highway, bridge and pavement engineering consultancy.",
  "Project management and technical advisory services.",
  "Bridge Management System (BMS) development and implementation support.",
  "Engineering design reviews and standards development.",
  "Infrastructure policy development and PPP guideline preparation.",
  "Stakeholder consultations and institutional coordination.",
  "Technical report preparation and engineering research.",
  "Localisation of international engineering manuals and best practices.",
  "Pavement, bridge and drainage infrastructure assessments.",
  "Capacity building and technical support for transport sector institutions.",
  "Development of digital platforms, websites and customised software solutions.",
];

/** SELECTED PROJECTS */
export const SELECTED_PROJECTS: ReadonlyArray<{
  id: string;
  title: string;
  client: string;
  clientCountry: string;
  bullets: ReadonlyArray<string>;
  isImmeProject?: boolean;
}> = [
  {
    id: "integrated-manual-facility-management",
    title:
      "Project Management Consultancy Services for the Establishment of an Integrated Manual and Main Facility Management System of Expressways in Uganda",
    client: "Dohwa Engineering Co. Ltd",
    clientCountry: "Republic of Korea",
    bullets: [
      "Development of integrated operations and maintenance manuals.",
      "Stakeholder consultations with the Ministry of Works and Transport (MoWT), UNRA and other agencies.",
      "Technical investigations, engineering research and project reporting.",
      "Support for pavement, bridge, drainage and asset management systems.",
    ],
    isImmeProject: true,
  },
  {
    id: "uganda-design-manual-review",
    title: "Consultancy Services for the Review of the Uganda Design Manual and Collection of African Design Manuals",
    client: "Dohwa Engineering Co. Ltd",
    clientCountry: "Republic of Korea",
    bullets: [
      "Review of Uganda's highway design standards.",
      "Comparative assessment of African highway design manuals.",
      "Preparation of draft and final technical review reports.",
    ],
  },
  {
    id: "expressways-om-manual-localisation",
    title: "Consultancy Services for the Localisation Review for the Development of Uganda Expressways Operations & Maintenance Manual",
    client: "Korea Expressway Corporation",
    clientCountry: "Republic of Korea",
    bullets: [
      "Localisation of Uganda's Expressway O&M Manual.",
      "Review of manuals covering pavements, bridges, tunnels, drainage, traffic management and disaster management.",
      "Technical editing and adaptation to Ugandan conditions.",
    ],
  },
  {
    id: "ppp-feasibility-review-guidelines",
    title: "Consultancy Services for the Development of Uganda Expressways Public-Private Partnership (PPP) Feasibility Review Guidelines",
    client: "Korea Expressway Corporation",
    clientCountry: "Republic of Korea",
    bullets: [
      "Stakeholder consultations with the Ministry of Works and Transport.",
      "Review of Uganda's PPP legislation, transport policies and international best practices.",
      "Comparative studies of local and international PPP models.",
      "Preparation and submission of the Draft and Final Uganda Expressway PPP Feasibility Review Guidelines.",
    ],
  },
];

/** INTERNATIONAL TECHNICAL PARTNERSHIPS — specialised service areas enabled by the partnership */
export const PARTNERSHIP_SPECIALTIES: ReadonlyArray<string> = [
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
];

/** CLIENTS & PARTNERS */
export const CLIENTS: ReadonlyArray<{ id: string; name: string; country: string; role: string }> = [
  {
    id: "dohwa",
    name: "Dohwa Engineering Co. Ltd",
    country: "Republic of Korea",
    role: "Client — engineering manual & PPP consultancy",
  },
  {
    id: "kec",
    name: "Korea Expressway Corporation",
    country: "Republic of Korea",
    role: "Client — expressway O&M and PPP guideline consultancy",
  },
];

export const INSTITUTIONAL_STAKEHOLDERS: ReadonlyArray<{ id: string; name: string; role: string }> = [
  {
    id: "mowt",
    name: "Ministry of Works and Transport (MoWT)",
    role: "Government counterpart consulted across manual, O&M and PPP guideline development.",
  },
  {
    id: "unra",
    name: "Uganda National Roads Authority (UNRA)",
    role: "Agency partner consulted on facility management and asset management systems.",
  },
];

/** OUR TEAM — organised by function rather than named bios (no individual staff data published yet) */
export const TEAM_GROUPS: ReadonlyArray<{ id: string; title: string; description: string; areas: ReadonlyArray<string> }> = [
  {
    id: "engineering-consultancy",
    title: "Engineering & Consultancy Team",
    description:
      "Our Uganda-based engineering and consultancy practitioners lead transport planning, design, project management and infrastructure advisory work, coordinating directly with government institutions and international partners.",
    areas: ["Transport Planning", "Engineering Design", "Project Management", "Infrastructure Advisory"],
  },
  {
    id: "korean-specialist-network",
    title: "On-Call Korean Technical Specialist Network",
    description:
      "A network of highly experienced engineering specialists from the Republic of Korea provides on-call technical support and international expertise, combining global best practice with Uganda's local knowledge.",
    areas: [
      "Expressway Engineering",
      "Bridge Management Systems",
      "Operations & Maintenance",
      "Asset Management",
      "Infrastructure Planning",
      "Capacity Building",
    ],
  },
  {
    id: "digital-solutions",
    title: "Digital Solutions Team",
    description:
      "Our software and digital team develops websites, digital platforms and customised software that support infrastructure management, institutional operations and business growth.",
    areas: ["Website Design & Development", "Custom Software", "GIS", "Digital Platforms"],
  },
];

/** NEWS & INSIGHTS — editorial focus areas (no published articles yet) */
export const INSIGHT_TOPICS: ReadonlyArray<{ id: string; title: string; description: string }> = [
  {
    id: "bms-topic",
    title: "Bridge Management Systems in East Africa",
    description: "Practical notes on digitising bridge inspection and maintenance planning.",
  },
  {
    id: "ppp-topic",
    title: "PPP Models for Expressway Infrastructure",
    description: "Comparative perspectives on Public-Private Partnership frameworks for road infrastructure.",
  },
  {
    id: "standards-topic",
    title: "Localising International Engineering Manuals",
    description: "Approaches to adapting global design and O&M standards to Ugandan conditions.",
  },
  {
    id: "digital-topic",
    title: "Digital Tools for Infrastructure Management",
    description: "How GIS, asset databases and custom software strengthen institutional operations.",
  },
];

/** Top-level navigation — matches the site navigation specified for Proxy Consultants Ltd. */
export const PROXY_NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Our Experience", href: "/experience" },
  { label: "Selected Projects", href: "/projects" },
  { label: "International Technical Partnerships", href: "/partnerships" },
  { label: "Our Team", href: "/team" },
  { label: "Clients & Partners", href: "/clients" },
  { label: "News & Insights", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

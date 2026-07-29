import type { MetadataRoute } from "next";
import { ALL_PAGES } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.proxyconsultants.co.ug";
  return ALL_PAGES.map((page) => ({
    url: `${base}${page.href}`,
    lastModified: new Date(),
  }));
}

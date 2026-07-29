import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Updates, technical insights and project news from Proxy Consultants Ltd.",
};

// News & Insights content to be supplied by client. Placeholder posts below establish the
// listing layout (title, date, excerpt, read more) and can be replaced with real articles.
const NEWS_PLACEHOLDERS = [
  {
    title: "Article title to be announced",
    date: "TBC",
    excerpt: "A short summary of this article will appear here once content is available.",
  },
  {
    title: "Article title to be announced",
    date: "TBC",
    excerpt: "A short summary of this article will appear here once content is available.",
  },
  {
    title: "Article title to be announced",
    date: "TBC",
    excerpt: "A short summary of this article will appear here once content is available.",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Insights"
        title="Updates and technical insights from Proxy Consultants Ltd."
        description="This section will be updated with project news, technical articles and sector insights."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NEWS_PLACEHOLDERS.map((post, index) => (
              <Reveal key={index} delay={index * 60}>
                <article className="flex h-full flex-col border border-ink-100 bg-white">
                  <div className="flex aspect-[16/10] items-center justify-center bg-ink-50">
                    <span className="font-display text-sm font-medium text-ink-300">Image</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">{post.date}</p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-ink-950">{post.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-300">
                      Read more
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NewsGrid } from "@/components/news-grid";
import { PageHero } from "@/components/page-hero";
import { getArticles } from "@/lib/news";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Updates, technical insights and project news from Proxy Consultants Ltd.",
};

// Articles are read from data/news.json on each request so admin edits show up immediately.
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHero title="News & Insights" />

      <section className="py-20 sm:py-28">
        <Container>
          <NewsGrid articles={articles} />
        </Container>
      </section>
    </>
  );
}

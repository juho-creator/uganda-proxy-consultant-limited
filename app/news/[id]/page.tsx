import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ShimmerImage } from "@/components/shimmer-image";
import { formatArticleDate } from "@/lib/article-date";
import { getArticle } from "@/lib/news";

// Read on each request so admin edits show up immediately.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).id);
  return article ? { title: article.title, description: article.excerpt } : { title: "Article not found" };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).id);
  if (!article) notFound();

  return (
    <>
      <PageHero eyebrow={formatArticleDate(article.date)} title={article.title} />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition-colors hover:text-clay-600"
            >
              <span aria-hidden="true">&larr;</span>
              All news
            </Link>

            <p className="mt-8 text-xl leading-relaxed text-ink-800">{article.excerpt}</p>

            {article.thumbnail && (
              <ShimmerImage src={article.thumbnail} alt={article.title} className="mt-10 aspect-[16/9] border border-ink-100" />
            )}

            <div className="mt-10 space-y-6">
              {article.body.length === 0 && (
                <p className="text-base leading-relaxed text-ink-500">The full article will be published here soon.</p>
              )}
              {article.body.map((block, index) =>
                block.type === "paragraph" ? (
                  <p key={index} className="whitespace-pre-line text-base leading-relaxed text-ink-700 sm:text-lg sm:leading-relaxed">
                    {block.text}
                  </p>
                ) : (
                  <ShimmerImage
                    key={index}
                    src={block.src}
                    alt=""
                    className="my-2 min-h-48 border border-ink-100"
                    imgClassName="h-auto w-full"
                  />
                )
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { clsx } from "clsx";
import { Reveal } from "./reveal";
import { ShimmerImage } from "./shimmer-image";
import { formatArticleDate } from "@/lib/article-date";
import type { Article } from "@/lib/news";

/** News listing: each card links to the full article. Articles are managed from /admin. */
export function NewsGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <p className="text-center text-sm text-ink-500">No articles yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((post, index) => {
        const href = `/news/${encodeURIComponent(post.id)}`;
        return (
          <Reveal key={post.id} delay={index * 60}>
            <article className="group flex h-full flex-col border border-ink-100 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-950/5">
              <Link href={href} tabIndex={-1} aria-hidden="true">
                <ArticleThumbnail article={post} />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <time dateTime={post.date} className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                  {formatArticleDate(post.date)}
                </time>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink-950">
                  <Link href={href} className="transition-colors hover:text-clay-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
                <Link
                  href={href}
                  className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-clay-600 transition-colors hover:text-clay-700"
                >
                  Read more
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                  <span className="sr-only">: {post.title}</span>
                </Link>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export function ArticleThumbnail({ article, className }: { article: Article; className?: string }) {
  if (article.thumbnail) {
    return <ShimmerImage src={article.thumbnail} alt={article.title} className={clsx("aspect-[16/10]", className)} />;
  }
  return (
    <div className={clsx("flex aspect-[16/10] items-center justify-center bg-ink-50", className)}>
      <span className="font-display text-sm font-medium text-ink-300">Image</span>
    </div>
  );
}

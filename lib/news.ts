import path from "path";
import { deleteImages, deleteUnusedImages, readJson, writeJson } from "./uploads";

export type ArticleBlock = { type: "paragraph"; text: string } | { type: "image"; src: string };

export type Article = {
  id: string;
  title: string;
  /** ISO calendar date, e.g. "2026-10-10" — see lib/article-date. */
  date: string;
  excerpt: string;
  /** Card and header image, served from /api/images. */
  thumbnail?: string;
  /** Full article content shown on the "Read more" page. */
  body: ArticleBlock[];
};

// Articles are managed from /admin and stored on disk (see lib/uploads for the hosting caveat).
const NEWS_FILE = path.join(process.cwd(), "data", "news.json");

export async function getArticles(): Promise<Article[]> {
  const articles = await readJson<Article[]>(NEWS_FILE);
  return articles.map((article) => ({ ...article, body: article.body ?? [] }));
}

export async function getArticle(id: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((article) => article.id === id) ?? null;
}

function articleImages(article: Article) {
  return [article.thumbnail, ...article.body.map((block) => (block.type === "image" ? block.src : undefined))];
}

/** Adds a new article to the top of the list. */
export async function createArticle(article: Article) {
  const articles = await getArticles();
  await writeJson(NEWS_FILE, [article, ...articles]);
}

/** Replaces an article and deletes any of its images that are no longer used. */
export async function replaceArticle(article: Article): Promise<boolean> {
  const articles = await getArticles();
  const index = articles.findIndex((existing) => existing.id === article.id);
  if (index === -1) return false;
  const previous = articles[index];
  articles[index] = article;
  await writeJson(NEWS_FILE, articles);
  await deleteUnusedImages(articleImages(previous), articleImages(article));
  return true;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await getArticles();
  const target = articles.find((article) => article.id === id);
  if (!target) return false;
  await writeJson(NEWS_FILE, articles.filter((article) => article.id !== id));
  await deleteImages(articleImages(target));
  return true;
}

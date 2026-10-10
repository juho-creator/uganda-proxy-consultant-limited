import { NextResponse } from "next/server";
import { adminHandler, parseArticleForm } from "@/lib/admin-forms";
import { deleteArticle, getArticle, replaceArticle } from "@/lib/news";

type Context = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Article not found." }, { status: 404 });

/** Saves edits from the admin article form. */
export async function PUT(request: Request, { params }: Context) {
  return adminHandler(async (uploaded) => {
    const { id } = await params;
    const existing = await getArticle(id);
    if (!existing) return notFound();
    const article = await parseArticleForm(await request.formData(), id, existing, uploaded);
    await replaceArticle(article);
    return NextResponse.json({ article });
  });
}

/** Deletes an article and its images. */
export async function DELETE(_request: Request, { params }: Context) {
  return adminHandler(async () => {
    const { id } = await params;
    return (await deleteArticle(id)) ? NextResponse.json({ ok: true }) : notFound();
  });
}

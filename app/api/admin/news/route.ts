import { NextResponse } from "next/server";
import { adminHandler, parseArticleForm } from "@/lib/admin-forms";
import { createArticle } from "@/lib/news";
import { makeId } from "@/lib/uploads";

/** Creates an article from the admin article form. */
export async function POST(request: Request) {
  return adminHandler(async (uploaded) => {
    const form = await request.formData();
    const article = await parseArticleForm(form, makeId(String(form.get("title") ?? "")), null, uploaded);
    await createArticle(article);
    return NextResponse.json({ article }, { status: 201 });
  });
}

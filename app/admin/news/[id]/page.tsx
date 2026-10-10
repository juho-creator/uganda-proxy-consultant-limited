import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleForm } from "@/components/admin/article-form";
import { getArticle } from "@/lib/news";
import { requireAdmin } from "@/lib/require-admin";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const article = await getArticle((await params).id);
  if (!article) notFound();

  return (
    <AdminShell title="Edit article" back>
      <div className="max-w-3xl">
        <ArticleForm article={article} />
      </div>
    </AdminShell>
  );
}

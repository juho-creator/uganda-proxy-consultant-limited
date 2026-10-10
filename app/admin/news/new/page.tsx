import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleForm } from "@/components/admin/article-form";
import { requireAdmin } from "@/lib/require-admin";

export const metadata: Metadata = { title: "New article" };

export default async function NewArticlePage() {
  await requireAdmin();
  return (
    <AdminShell title="New article" back>
      <div className="max-w-3xl">
        <ArticleForm />
      </div>
    </AdminShell>
  );
}

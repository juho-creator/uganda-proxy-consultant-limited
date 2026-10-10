import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/container";
import { isAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin");

  return (
    <section className="bg-ink-50 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-sm border border-ink-100 bg-white p-8 shadow-sm">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-600">Admin</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-950">Sign in</h1>
          <p className="mt-2 text-sm text-ink-600">Manage news articles and team information.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </Container>
    </section>
  );
}

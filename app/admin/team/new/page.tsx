import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { TeamForm } from "@/components/admin/team-form";
import { requireAdmin } from "@/lib/require-admin";

export const metadata: Metadata = { title: "Add team member" };

export default async function NewTeamMemberPage() {
  await requireAdmin();
  return (
    <AdminShell title="Add team member" back>
      <div className="max-w-3xl">
        <TeamForm />
      </div>
    </AdminShell>
  );
}

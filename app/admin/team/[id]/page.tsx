import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { TeamForm } from "@/components/admin/team-form";
import { requireAdmin } from "@/lib/require-admin";
import { getTeamMember } from "@/lib/team";

export const metadata: Metadata = { title: "Edit team member" };

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const member = await getTeamMember((await params).id);
  if (!member) notFound();

  return (
    <AdminShell title={`Edit ${member.name}`} back>
      <div className="max-w-3xl">
        <TeamForm member={member} />
      </div>
    </AdminShell>
  );
}

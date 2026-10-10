import { NextResponse } from "next/server";
import { adminHandler, parseTeamForm } from "@/lib/admin-forms";
import { createTeamMember } from "@/lib/team";
import { makeId } from "@/lib/uploads";

/** Adds a team member from the admin team form. */
export async function POST(request: Request) {
  return adminHandler(async (uploaded) => {
    const form = await request.formData();
    const member = await parseTeamForm(form, makeId(String(form.get("name") ?? "")), null, uploaded);
    await createTeamMember(member);
    return NextResponse.json({ member }, { status: 201 });
  });
}

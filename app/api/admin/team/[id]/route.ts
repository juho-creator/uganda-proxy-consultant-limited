import { NextResponse } from "next/server";
import { adminHandler, parseTeamForm } from "@/lib/admin-forms";
import { deleteTeamMember, getTeamMember, moveTeamMember, replaceTeamMember } from "@/lib/team";

type Context = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Team member not found." }, { status: 404 });

/** Saves edits from the admin team form. */
export async function PUT(request: Request, { params }: Context) {
  return adminHandler(async (uploaded) => {
    const { id } = await params;
    const existing = await getTeamMember(id);
    if (!existing) return notFound();
    const member = await parseTeamForm(await request.formData(), id, existing, uploaded);
    await replaceTeamMember(member);
    return NextResponse.json({ member });
  });
}

/** Reorders a member: JSON body `{ "move": -1 }` (up) or `{ "move": 1 }` (down). */
export async function PATCH(request: Request, { params }: Context) {
  return adminHandler(async () => {
    const { id } = await params;
    const { move } = (await request.json().catch(() => ({}))) as { move?: unknown };
    if (move !== -1 && move !== 1) return NextResponse.json({ error: "Invalid move." }, { status: 400 });
    return (await moveTeamMember(id, move)) ? NextResponse.json({ ok: true }) : notFound();
  });
}

/** Removes a team member and their photo. */
export async function DELETE(_request: Request, { params }: Context) {
  return adminHandler(async () => {
    const { id } = await params;
    return (await deleteTeamMember(id)) ? NextResponse.json({ ok: true }) : notFound();
  });
}

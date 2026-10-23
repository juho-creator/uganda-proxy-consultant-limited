import path from "path";
import { deleteImages, deleteUnusedImages, readJson, writeJson } from "./uploads";

export type TeamList = { label: string; items: string[] };

/** A labeled detail such as "Date of birth" or "Email", shown under the member's title. */
export type TeamFact = { label: string; value: string };

/** One position in a member's employment record. Optional fields are hidden when empty. */
export type TeamExperience = {
  period: string;
  position: string;
  organization: string;
  project?: string;
  client?: string;
  country?: string;
  reference?: string;
  description?: string;
  activities: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  /** One-sentence introduction shown as the lead line. */
  summary: string;
  /** Career background, one short paragraph per entry. */
  bio: string[];
  /** Labeled personal/contact details, e.g. Profession, Citizenship, Email. */
  facts: TeamFact[];
  /** Headed lists shown under the bio, e.g. "Education" or "Professional memberships". */
  lists: TeamList[];
  /** Work experience, most recent first. */
  experience: TeamExperience[];
  /** Portrait served from /api/images. */
  photo?: string;
};

// Team members are managed from /admin and stored on disk (see lib/uploads for the hosting caveat).
const TEAM_FILE = path.join(process.cwd(), "data", "team.json");

export async function getTeam(): Promise<TeamMember[]> {
  const team = await readJson<TeamMember[]>(TEAM_FILE);
  // Older entries may predate facts/experience; default them so callers can rely on arrays.
  return team.map((member) => ({ ...member, facts: member.facts ?? [], lists: member.lists ?? [], experience: member.experience ?? [] }));
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  const team = await getTeam();
  return team.find((member) => member.id === id) ?? null;
}

/** Adds a new member to the end of the list. */
export async function createTeamMember(member: TeamMember) {
  const team = await getTeam();
  await writeJson(TEAM_FILE, [...team, member]);
}

export async function replaceTeamMember(member: TeamMember): Promise<boolean> {
  const team = await getTeam();
  const index = team.findIndex((existing) => existing.id === member.id);
  if (index === -1) return false;
  const previous = team[index];
  team[index] = member;
  await writeJson(TEAM_FILE, team);
  await deleteUnusedImages([previous.photo], [member.photo]);
  return true;
}

/** Moves a member one place up or down in the page order. */
export async function moveTeamMember(id: string, offset: -1 | 1): Promise<boolean> {
  const team = await getTeam();
  const index = team.findIndex((member) => member.id === id);
  const target = index + offset;
  if (index === -1 || target < 0 || target >= team.length) return false;
  [team[index], team[target]] = [team[target], team[index]];
  await writeJson(TEAM_FILE, team);
  return true;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const team = await getTeam();
  const target = team.find((member) => member.id === id);
  if (!target) return false;
  await writeJson(TEAM_FILE, team.filter((member) => member.id !== id));
  await deleteImages([target.photo]);
  return true;
}

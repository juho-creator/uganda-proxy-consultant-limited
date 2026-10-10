import path from "path";
import { deleteImages, deleteUnusedImages, readJson, writeJson } from "./uploads";

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  /** One-sentence introduction shown as the lead line. */
  summary: string;
  /** Career background, one short paragraph per entry. */
  bio: string[];
  highlightsLabel: string;
  highlights: string[];
  /** Portrait served from /api/images. */
  photo?: string;
};

// Team members are managed from /admin and stored on disk (see lib/uploads for the hosting caveat).
const TEAM_FILE = path.join(process.cwd(), "data", "team.json");

export async function getTeam(): Promise<TeamMember[]> {
  return readJson<TeamMember[]>(TEAM_FILE);
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

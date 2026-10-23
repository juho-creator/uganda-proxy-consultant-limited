import { NextResponse } from "next/server";
import { isIsoDate } from "./article-date";
import { isAdminSession } from "./admin-auth";
import type { Article, ArticleBlock } from "./news";
import type { TeamExperience, TeamFact, TeamList, TeamMember } from "./team";
import { ImageUploadError, deleteImages, isStoredImageSrc, saveImage } from "./uploads";

// Shared parsing for the admin create/edit endpoints. Forms arrive as multipart data so images can
// be uploaded in the same request as the text they belong to.

export class FormError extends Error {}

export function unauthorized() {
  return NextResponse.json({ error: "Your admin session has expired. Please log in again." }, { status: 401 });
}

/** Wraps an admin handler: checks the session, and turns form/upload errors into 400 responses. */
export async function adminHandler(handler: (uploaded: string[]) => Promise<Response>): Promise<Response> {
  if (!(await isAdminSession())) return unauthorized();
  // Images saved during this request, removed again if the request fails part-way through.
  const uploaded: string[] = [];
  try {
    return await handler(uploaded);
  } catch (error) {
    await deleteImages(uploaded);
    if (error instanceof FormError || error instanceof ImageUploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[admin] request failed", error);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}

function text(form: FormData, field: string) {
  return String(form.get(field) ?? "").trim();
}

function requireText(form: FormData, field: string, label: string) {
  const value = text(form, field);
  if (!value) throw new FormError(`${label} is required.`);
  return value;
}

/** Splits text into trimmed, non-empty entries on the given separator. */
function splitEntries(value: string, separator: RegExp) {
  return value
    .split(separator)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Resolves an image field set by the ImagePicker: `<field>Action` is keep | remove | replace, with
 * the new file in `<field>` for replace.
 */
async function resolveImage(form: FormData, field: string, current: string | undefined, uploaded: string[]) {
  const action = form.get(`${field}Action`);
  if (action === "remove") return undefined;
  if (action === "replace") {
    const file = form.get(field);
    if (!(file instanceof File) || file.size === 0) throw new FormError("Choose an image to upload.");
    const src = await saveImage(file);
    uploaded.push(src);
    return src;
  }
  return current;
}

type IncomingBlock = { type?: unknown; text?: unknown; src?: unknown; upload?: unknown };

export async function parseArticleForm(form: FormData, id: string, existing: Article | null, uploaded: string[]): Promise<Article> {
  const title = requireText(form, "title", "Title");
  const excerpt = requireText(form, "excerpt", "Summary");
  const date = text(form, "date");
  if (!isIsoDate(date)) throw new FormError("Choose a valid date.");

  let incoming: IncomingBlock[];
  try {
    incoming = JSON.parse(String(form.get("body") ?? "[]"));
    if (!Array.isArray(incoming)) throw new Error();
  } catch {
    throw new FormError("Article content is malformed.");
  }

  const body: ArticleBlock[] = [];
  for (const block of incoming) {
    if (block?.type === "paragraph" && typeof block.text === "string" && block.text.trim()) {
      body.push({ type: "paragraph", text: block.text.trim() });
    } else if (block?.type === "image") {
      const file = typeof block.upload === "string" && block.upload.startsWith("file-") ? form.get(block.upload) : null;
      if (file instanceof File && file.size > 0) {
        const src = await saveImage(file);
        uploaded.push(src);
        body.push({ type: "image", src });
      } else if (isStoredImageSrc(block.src)) {
        body.push({ type: "image", src: block.src });
      }
    }
  }

  const thumbnail = await resolveImage(form, "thumbnail", existing?.thumbnail, uploaded);
  return { id, title, date, excerpt, body, ...(thumbnail ? { thumbnail } : {}) };
}

export async function parseTeamForm(form: FormData, id: string, existing: TeamMember | null, uploaded: string[]): Promise<TeamMember> {
  const name = requireText(form, "name", "Name");
  const title = requireText(form, "title", "Job title");
  const summary = text(form, "summary");
  // Paragraphs are separated by a blank line.
  const bio = splitEntries(text(form, "bio"), /\n\s*\n/);
  const lists = parseLists(String(form.get("lists") ?? "[]"));
  const facts = parseFacts(String(form.get("facts") ?? "[]"));
  const experience = parseExperience(String(form.get("experience") ?? "[]"));

  const photo = await resolveImage(form, "photo", existing?.photo, uploaded);
  return { id, name, title, summary, facts, bio, lists, experience, ...(photo ? { photo } : {}) };
}

function parseJsonArray(raw: string, what: string): Record<string, unknown>[] {
  let incoming: unknown;
  try {
    incoming = JSON.parse(raw);
  } catch {
    throw new FormError(`${what} are malformed.`);
  }
  if (!Array.isArray(incoming)) throw new FormError(`${what} are malformed.`);
  return incoming.filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null);
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStrings(value: unknown) {
  return Array.isArray(value) ? value.map(cleanString).filter(Boolean) : [];
}

/** Facts arrive as JSON `[{ label, value }]`; incomplete rows are dropped. */
function parseFacts(raw: string): TeamFact[] {
  return parseJsonArray(raw, "Details").flatMap((fact) => {
    const label = cleanString(fact.label);
    const value = cleanString(fact.value);
    return label && value ? [{ label, value }] : [];
  });
}

/** Experience arrives as JSON entries; each needs at least a position or organization. */
function parseExperience(raw: string): TeamExperience[] {
  return parseJsonArray(raw, "Employment entries").flatMap((entry) => {
    const position = cleanString(entry.position);
    const organization = cleanString(entry.organization);
    if (!position && !organization) return [];
    const optional = (["summary", "project", "client", "country", "reference", "description"] as const).reduce<Partial<TeamExperience>>(
      (fields, key) => {
        const value = cleanString(entry[key]);
        return value ? { ...fields, [key]: value } : fields;
      },
      {}
    );
    return [{ period: cleanString(entry.period), position, organization, ...optional, activities: cleanStrings(entry.activities) }];
  });
}

/** Lists arrive as JSON `[{ label, items }]`; lists without a heading or any items are dropped. */
function parseLists(raw: string): TeamList[] {
  let incoming: unknown;
  try {
    incoming = JSON.parse(raw);
  } catch {
    throw new FormError("Lists are malformed.");
  }
  if (!Array.isArray(incoming)) throw new FormError("Lists are malformed.");

  return incoming.flatMap((list: { label?: unknown; items?: unknown }) => {
    const label = typeof list?.label === "string" ? list.label.trim() : "";
    const items = Array.isArray(list?.items)
      ? list.items.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
      : [];
    return label && items.length ? [{ label, items }] : [];
  });
}

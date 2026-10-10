import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Uploaded images (article thumbnails/body images, team photos) are stored on disk and served by
// the /api/images route rather than /public, because `next start` only serves public files that
// existed at build time. This needs a writable filesystem (a normal Node server).
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export const IMAGE_ROUTE = "/api/images/";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const IMAGE_NAME_RE = /^[a-f0-9-]{36}\.(png|jpg|gif|webp)$/;
const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

/** True for URLs pointing at an image this site stored, e.g. "/api/images/<uuid>.png". */
export function isStoredImageSrc(src: unknown): src is string {
  return typeof src === "string" && src.startsWith(IMAGE_ROUTE) && IMAGE_NAME_RE.test(src.slice(IMAGE_ROUTE.length));
}

/** Detects the real image type from the file's first bytes, ignoring its claimed name/type. */
function sniffImageType(bytes: Buffer): string | null {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"))) return "gif";
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

export class ImageUploadError extends Error {}

/** Stores an uploaded PNG, JPEG, GIF or WebP image and returns its public URL. */
export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new ImageUploadError(`"${file.name}" is larger than 5 MB.`);
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = sniffImageType(bytes);
  if (!ext) throw new ImageUploadError(`"${file.name}" is not a PNG, JPEG, GIF or WebP image.`);

  const name = `${randomUUID()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return `${IMAGE_ROUTE}${name}`;
}

export async function readImage(name: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (!IMAGE_NAME_RE.test(name)) return null;
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return { data, contentType: CONTENT_TYPES[name.split(".").pop()!] };
  } catch {
    return null;
  }
}

export async function deleteImages(srcs: (string | undefined)[]) {
  await Promise.all(
    srcs.filter(isStoredImageSrc).map((src) => fs.rm(path.join(UPLOAD_DIR, src.slice(IMAGE_ROUTE.length)), { force: true }))
  );
}

/** Deletes images that were used before an edit but no longer are. */
export async function deleteUnusedImages(before: (string | undefined)[], after: (string | undefined)[]) {
  const stillUsed = new Set(after);
  await deleteImages(before.filter((src) => !stillUsed.has(src)));
}

export async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf-8")) as T;
}

export async function writeJson(file: string, value: unknown) {
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

/** URL-friendly id from a title or name, with a random suffix so ids never collide. */
export function makeId(label: string) {
  const slug = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "item"}-${randomUUID().slice(0, 6)}`;
}

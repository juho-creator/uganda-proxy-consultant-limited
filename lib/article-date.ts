// Article dates are stored as ISO calendar dates ("2026-10-10") and shown as "October 10, 2026".
// Kept free of server-only imports so client components can format dates too.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const displayFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  // Rejects impossible dates like 2026-02-31, which Date would silently roll over.
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** "2026-10-10" → "October 10, 2026". Anything that isn't an ISO date is returned unchanged. */
export function formatArticleDate(value: string) {
  return isIsoDate(value) ? displayFormat.format(new Date(`${value}T00:00:00Z`)) : value;
}

/** Today's date in the viewer's own time zone, as an ISO calendar date. */
export function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

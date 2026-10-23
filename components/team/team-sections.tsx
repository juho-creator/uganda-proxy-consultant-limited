import { clsx } from "clsx";
import { Linkify } from "../linkify";
import { ShimmerImage } from "../shimmer-image";
import type { TeamExperience, TeamFact, TeamList, TeamMember } from "@/lib/team";

/** Lists longer than this show the rest behind a "Show more" toggle. */
const VISIBLE_ITEMS = 6;
/** Lists whose items are all this short read best as tags (e.g. software, languages). */
const TAG_MAX_LENGTH = 40;

export function sectionId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MemberPhoto({ member, className }: { member: TeamMember; className?: string }) {
  if (member.photo) {
    return <ShimmerImage src={member.photo} alt={member.name} className={clsx("aspect-[4/5] border border-ink-100", className)} />;
  }
  return (
    <div className={clsx("flex aspect-[4/5] items-center justify-center border border-ink-100 bg-ink-50", className)}>
      <span className="font-display text-4xl font-semibold text-ink-200">
        {member.name
          .replace(/^Eng\.\s*/, "")
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </span>
    </div>
  );
}

export function FactGrid({ facts }: { facts: TeamFact[] }) {
  return (
    <dl className="grid gap-px overflow-hidden border border-ink-100 bg-ink-100 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-white px-4 py-3">
          <dt className="text-[0.7rem] font-semibold uppercase tracking-widest text-ink-400">{fact.label}</dt>
          <dd className="mt-1 text-sm font-medium text-ink-900">
            <Linkify text={fact.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "Primary — secondary" items render as a bold line over a muted line, which is much easier to scan. */
function ListItem({ item }: { item: string }) {
  const split = item.indexOf(" — ");
  if (split === -1) {
    return (
      <p className="text-sm leading-relaxed text-ink-700">
        <Linkify text={item} />
      </p>
    );
  }
  return (
    <>
      <p className="text-sm font-semibold leading-snug text-ink-950">
        <Linkify text={item.slice(0, split)} />
      </p>
      <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
        <Linkify text={item.slice(split + 3)} />
      </p>
    </>
  );
}

function ListRows({ items }: { items: string[] }) {
  return (
    <ul className="divide-y divide-ink-100">
      {items.map((item) => (
        <li key={item} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
          <div className="min-w-0">
            <ListItem item={item} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ListBody({ list }: { list: TeamList }) {
  if (list.items.every((item) => item.length <= TAG_MAX_LENGTH)) {
    return (
      <ul className="flex flex-wrap gap-2">
        {list.items.map((item) => (
          <li key={item} className="rounded-sm border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-800">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const visible = list.items.slice(0, VISIBLE_ITEMS);
  const hidden = list.items.slice(VISIBLE_ITEMS);
  return (
    <>
      <ListRows items={visible} />
      {hidden.length > 0 && (
        <details className="group mt-3 border-t border-ink-100 pt-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-clay-600 hover:text-clay-700 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show {hidden.length} more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <div className="mt-3">
            <ListRows items={hidden} />
          </div>
        </details>
      )}
    </>
  );
}

function ExperienceDetails({ entry }: { entry: TeamExperience }) {
  // Organization, client and country are already shown on the entry itself.
  if (!entry.reference && !entry.description && entry.activities.length === 0) return null;

  return (
    <details className="group mt-4 border-t border-ink-100 pt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-clay-600 hover:text-clay-700 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">
          {entry.activities.length > 0 ? `View scope and ${entry.activities.length} key activities` : "View details"}
        </span>
        <span className="hidden group-open:inline">Hide details</span>
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          &#9662;
        </span>
      </summary>
      <div className="mt-3 space-y-4">
        {entry.description && <p className="text-sm leading-relaxed text-ink-700">{entry.description}</p>}
        {entry.activities.length > 0 && (
          <ul className="space-y-1.5">
            {entry.activities.map((activity) => (
              <li key={activity} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
                {activity}
              </li>
            ))}
          </ul>
        )}
        {entry.reference && (
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-ink-500">Reference: </span>
            <Linkify text={entry.reference} />
          </p>
        )}
      </div>
    </details>
  );
}

const YEAR_RE = /\b(?:19|20)\d{2}\b/g;

/** Groups consecutive entries by the year they started, e.g. "August 2026 – present" → 2026. */
function groupByStartYear(entries: TeamExperience[]) {
  const groups: { year: string; entries: TeamExperience[] }[] = [];
  for (const entry of entries) {
    const year = entry.period.match(YEAR_RE)?.[0] ?? "Other";
    const last = groups[groups.length - 1];
    if (last?.year === year) last.entries.push(entry);
    else groups.push({ year, entries: [entry] });
  }
  return groups;
}

function isCurrent(entry: TeamExperience) {
  return /present|to-?date/i.test(entry.period);
}

/** "17 positions · 2009 – present" style overview line for the top of the timeline. */
export function experienceOverview(entries: TeamExperience[]) {
  const years = entries.flatMap((entry) => entry.period.match(YEAR_RE) ?? []).map(Number);
  const span = years.length
    ? `${Math.min(...years)} – ${entries.some(isCurrent) ? "present" : Math.max(...years)}`
    : null;
  const organizations = new Set(entries.map((entry) => entry.organization).filter(Boolean)).size;
  return [
    `${entries.length} ${entries.length === 1 ? "position" : "positions"}`,
    organizations > 1 ? `${organizations} organizations` : null,
    span,
  ]
    .filter(Boolean)
    .join(" · ");
}

function ExperienceCard({ entry }: { entry: TeamExperience }) {
  const tags = [
    entry.organization && { label: entry.organization, strong: true },
    entry.client && { label: `Client: ${entry.client}` },
    entry.country && { label: entry.country },
  ].filter((tag): tag is { label: string; strong?: boolean } => Boolean(tag));

  return (
    <article className="border border-ink-100 bg-white p-5 transition-shadow hover:shadow-md hover:shadow-ink-950/5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">{entry.period}</p>
        {isCurrent(entry) && (
          <span className="rounded-sm bg-clay-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-clay-700">
            Current
          </span>
        )}
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink-950">{entry.position}</h3>
      {entry.project && <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{entry.project}</p>}
      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag.label}
              className={clsx(
                "rounded-sm px-2 py-1 text-xs",
                tag.strong ? "bg-ink-950 font-semibold text-white" : "bg-ink-50 font-medium text-ink-600"
              )}
            >
              {tag.label}
            </li>
          ))}
        </ul>
      )}
      <ExperienceDetails entry={entry} />
    </article>
  );
}

/**
 * Employment record as a vertical timeline grouped by start year: year markers on the rail, one
 * card per position with its headline facts visible and the scope/activities one click away.
 */
export function ExperienceTimeline({ entries }: { entries: TeamExperience[] }) {
  return (
    <ol className="relative">
      {/* The rail */}
      <span aria-hidden="true" className="absolute bottom-2 left-[0.3125rem] top-2 w-px bg-ink-200 sm:left-[4.8125rem]" />
      {groupByStartYear(entries).map((group, groupIndex) => (
        <li key={`${group.year}-${groupIndex}`} className="relative pb-10 last:pb-0 sm:grid sm:grid-cols-[4.5rem_1fr] sm:gap-x-6">
          <div className="mb-3 flex items-center gap-3 sm:mb-0 sm:block sm:pt-5 sm:text-right">
            <span
              aria-hidden="true"
              className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full bg-clay-500 ring-4 ring-white sm:absolute sm:left-[4.5rem] sm:top-6"
            />
            <span className="font-display text-xl font-semibold text-ink-950 sm:text-2xl">{group.year}</span>
          </div>
          <div className="space-y-4 pl-6 sm:pl-6">
            {group.entries.map((entry, index) => (
              <ExperienceCard key={`${entry.period}-${entry.position}-${index}`} entry={entry} />
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

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

/** Renders a role, breaking long combined roles after " & " (e.g. "Managing Director &" / "Professional …"). */
export function RoleTitle({ title }: { title: string }) {
  const split = title.indexOf(" & ");
  if (split === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, split)} &amp;
      <br />
      {title.slice(split + 3)}
    </>
  );
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

/** Personal details as bullet points, e.g. "• Nationality: Uganda". */
export function FactList({ facts }: { facts: TeamFact[] }) {
  return (
    <ul className="space-y-2.5">
      {facts.map((fact) => (
        <li key={fact.label} className="flex items-start gap-3 text-base text-ink-800">
          <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
          <span>
            <span className="font-semibold text-ink-950">{fact.label}:</span> <Linkify text={fact.value} />
          </span>
        </li>
      ))}
    </ul>
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

export function isCurrent(entry: TeamExperience) {
  return /present|to-?date/i.test(entry.period);
}

const cardLabelClass = "text-[0.7rem] font-semibold uppercase tracking-widest text-ink-400";

/**
 * One position, laid out as: timeline (dates, country, current badge) → role → one-sentence
 * summary → companies → key activities. The full project title, description and reference sit
 * behind a small "Project details" toggle at the bottom.
 */
export function ExperienceCard({ entry }: { entry: TeamExperience }) {
  // Positions without a written summary fall back to their project title.
  const summary = entry.summary ?? entry.project;
  const hasProjectDetails = Boolean((entry.summary && entry.project) || entry.description || entry.reference);

  return (
    <article className="flex h-full flex-col border border-ink-100 bg-white p-5 transition-shadow hover:shadow-md hover:shadow-ink-950/5 sm:p-6">
      {/* Timeline */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-clay-600">{entry.period}</p>
        {entry.country && <p className="text-xs text-ink-400">· {entry.country}</p>}
        {isCurrent(entry) && (
          <span className="rounded-sm bg-clay-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-clay-700">
            Current
          </span>
        )}
      </div>

      {/* Role */}
      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink-950">{entry.position}</h3>

      {/* One-sentence summary */}
      {summary && <p className="mt-2 text-sm leading-relaxed text-ink-700">{summary}</p>}

      {/* Companies */}
      {(entry.organization || entry.client) && (
        <dl className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
          {entry.organization && (
            <div className="flex gap-1.5">
              <dt className="shrink-0 font-semibold text-ink-500">Company:</dt>
              <dd className="text-ink-800">{entry.organization}</dd>
            </div>
          )}
          {entry.client && (
            <div className="flex gap-1.5">
              <dt className="shrink-0 font-semibold text-ink-500">Client:</dt>
              <dd className="text-ink-800">{entry.client}</dd>
            </div>
          )}
        </dl>
      )}

      {/* Key activities and roles */}
      {entry.activities.length > 0 && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          <p className={cardLabelClass}>Key activities</p>
          <ul className="mt-2.5 space-y-2">
            {entry.activities.map((activity) => (
              <li key={activity} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasProjectDetails && (
        <details className="group mt-auto pt-4">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-clay-600 [&::-webkit-details-marker]:hidden">
            Project details
            <span aria-hidden="true" className="transition-transform group-open:rotate-180">
              &#9662;
            </span>
          </summary>
          <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-600">
            {entry.summary && entry.project && <p className="font-medium text-ink-800">{entry.project}</p>}
            {entry.description && <p>{entry.description}</p>}
            {entry.reference && (
              <p>
                <span className="font-semibold text-ink-500">Reference: </span>
                <Linkify text={entry.reference} />
              </p>
            )}
          </div>
        </details>
      )}
    </article>
  );
}

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
  // Organization and country are already in the entry's headline.
  const meta = [
    { label: "Client", value: entry.client },
    { label: "Reference", value: entry.reference },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));
  if (meta.length === 0 && !entry.description && entry.activities.length === 0) return null;

  const body = (
    <div className="space-y-4">
      {meta.length > 0 && (
        <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[6rem_1fr]">
          {meta.map((item) => (
            <div key={item.label} className="contents">
              <dt className="font-semibold text-ink-400">{item.label}</dt>
              <dd className="text-ink-700">
                <Linkify text={item.value} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {entry.description && <p className="text-sm leading-relaxed text-ink-700">{entry.description}</p>}
      {entry.activities.length > 0 && (
        <ul className="space-y-1.5">
          {entry.activities.map((activity) => (
            <li key={activity} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
              <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-ink-400" aria-hidden="true" />
              {activity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <details className="group mt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-clay-600 hover:text-clay-700 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">View details</span>
        <span className="hidden group-open:inline">Hide details</span>
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          &#9662;
        </span>
      </summary>
      <div className="mt-4 border-l-2 border-ink-100 pl-4">{body}</div>
    </details>
  );
}

/** Employment record as a vertical timeline: headline always visible, details on demand. */
export function ExperienceTimeline({ entries }: { entries: TeamExperience[] }) {
  return (
    <ol className="relative border-l border-ink-200 pl-6 sm:pl-8">
      {entries.map((entry, index) => (
        <li key={`${entry.period}-${index}`} className="relative pb-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[calc(1.5rem+4.5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-clay-500 ring-1 ring-clay-500 sm:-left-[calc(2rem+4.5px)]"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-clay-600">{entry.period}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink-950">{entry.position}</h3>
          {entry.project && <p className="mt-1 text-sm leading-relaxed text-ink-700">{entry.project}</p>}
          <p className="mt-1 text-sm text-ink-500">
            {[entry.organization, entry.country].filter(Boolean).join(" · ")}
          </p>
          <ExperienceDetails entry={entry} />
        </li>
      ))}
    </ol>
  );
}

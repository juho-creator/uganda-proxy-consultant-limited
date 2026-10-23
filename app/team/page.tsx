import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Linkify } from "@/components/linkify";
import { Reveal } from "@/components/reveal";
import { ShimmerImage } from "@/components/shimmer-image";
import { getTeam, type TeamExperience, type TeamFact, type TeamList } from "@/lib/team";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership and engineering team at Proxy Consultants Ltd.",
};

/** Lists longer than this show the rest behind a "Show more" toggle. */
const VISIBLE_ITEMS = 6;

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
          <span>
            <Linkify text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function TeamListPanel({ list }: { list: TeamList }) {
  const visible = list.items.slice(0, VISIBLE_ITEMS);
  const hidden = list.items.slice(VISIBLE_ITEMS);

  return (
    <div className="border-l-2 border-clay-500 bg-ink-50 px-6 py-5">
      <p className="mb-3 font-display text-xs font-semibold uppercase tracking-widest text-ink-500">{list.label}</p>
      <ListItems items={visible} />
      {hidden.length > 0 && (
        <details className="group mt-2.5">
          <summary className="cursor-pointer list-none text-sm font-semibold text-clay-600 hover:text-clay-700 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show {hidden.length} more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <div className="mt-2.5">
            <ListItems items={hidden} />
          </div>
        </details>
      )}
    </div>
  );
}

function FactList({ facts }: { facts: TeamFact[] }) {
  return (
    <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
      {facts.map((fact) => (
        <div key={fact.label} className="contents">
          <dt className="font-semibold text-ink-500">{fact.label}</dt>
          <dd className="text-ink-800">
            <Linkify text={fact.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** One employment entry: a one-line summary that expands to the full project details. */
function ExperienceEntry({ entry }: { entry: TeamExperience }) {
  const meta = [
    { label: "Organization", value: entry.organization },
    { label: "Client", value: entry.client },
    { label: "Country", value: entry.country },
    { label: "Reference", value: entry.reference },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <details className="group border-b border-ink-100 py-4 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
        <span className="w-32 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-ink-400 sm:w-40">{entry.period}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink-950">{entry.position}</span>
          <span className="block text-sm text-ink-600">{entry.project ?? entry.organization}</span>
        </span>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-180"
        >
          &#9662;
        </span>
      </summary>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-700 sm:pl-44">
        <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[auto_1fr]">
          {meta.map((item) => (
            <div key={item.label} className="contents">
              <dt className="font-semibold text-ink-500">{item.label}</dt>
              <dd>
                <Linkify text={item.value} />
              </dd>
            </div>
          ))}
        </dl>
        {entry.description && <p>{entry.description}</p>}
        {entry.activities.length > 0 && <ListItems items={entry.activities} />}
      </div>
    </details>
  );
}

// Read on each request so changes made in /admin show up immediately.
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero title="Our Team" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="divide-y divide-ink-100">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={index * 60} className="py-12 first:pt-0 last:pb-0">
                <article className="grid gap-8 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12 lg:grid-cols-[minmax(0,18rem)_1fr]">
                  {member.photo ? (
                    <ShimmerImage
                      src={member.photo}
                      alt={member.name}
                      className="aspect-[4/5] w-full max-w-[18rem] border border-ink-100"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] w-full max-w-[18rem] items-center justify-center border border-ink-100 bg-ink-50">
                      <span className="font-display text-sm font-medium text-ink-300">Photo</span>
                    </div>
                  )}

                  <div className="max-w-2xl">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
                      {member.name}
                    </h2>
                    <p className="mt-1 font-display text-sm font-semibold uppercase tracking-widest text-clay-600">
                      {member.title}
                    </p>

                    {member.facts.length > 0 && <FactList facts={member.facts} />}

                    <p className="mt-6 text-lg leading-relaxed text-ink-800">{member.summary}</p>

                    <div className="mt-4 space-y-4">
                      {member.bio.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-relaxed text-ink-600">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {member.lists.length > 0 && (
                      <div className="mt-8 space-y-4">
                        {member.lists.map((list) => (
                          <TeamListPanel key={list.label} list={list} />
                        ))}
                      </div>
                    )}

                    {member.experience.length > 0 && (
                      <div className="mt-10">
                        <p className="font-display text-xs font-semibold uppercase tracking-widest text-ink-500">
                          Employment record
                        </p>
                        <p className="mt-1 text-xs text-ink-400">Select a position to see the project details.</p>
                        <div className="mt-3 border-t border-ink-100">
                          {member.experience.map((entry, entryIndex) => (
                            <ExperienceEntry key={`${entry.period}-${entryIndex}`} entry={entry} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

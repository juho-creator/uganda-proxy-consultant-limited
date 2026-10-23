import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { MemberPhoto, RoleTitle } from "@/components/team/team-sections";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership and engineering team at Proxy Consultants Ltd.",
};

// Read on each request so changes made in /admin show up immediately.
export const dynamic = "force-dynamic";

/*
 * Each card spans five rows of the page grid (photo, role, name, summary, link) through CSS
 * subgrid, so those parts line up across cards in the same row even when one member's role
 * wraps onto two lines. Roles sit at the bottom of their row so names always align.
 */
const CARD_ROWS = "row-span-5 grid grid-rows-subgrid gap-y-0";

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero title="Our Team" />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => {
              const href = `/team/${encodeURIComponent(member.id)}`;
              const summary = member.highlight || member.summary;
              return (
                <Reveal key={member.id} delay={index * 60} className={CARD_ROWS}>
                  <article
                    className={`group relative ${CARD_ROWS} border border-ink-100 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-950/5`}
                  >
                    <MemberPhoto member={member} className="w-full border-0 border-b" />

                    <p className="self-end px-6 pt-6 font-display text-[0.6875rem] font-semibold uppercase leading-5 tracking-wider text-clay-600">
                      <RoleTitle title={member.title} />
                    </p>

                    <h2 className="mt-1.5 px-6 font-display text-xl font-semibold tracking-tight text-ink-950">
                      <Link href={href} className="after:absolute after:inset-0">
                        {member.name}
                      </Link>
                    </h2>

                    <div className="px-6">
                      {summary && <p className="mt-3 text-sm leading-relaxed text-ink-600">{summary}</p>}
                    </div>

                    <span className="mt-5 inline-flex items-center gap-2 px-6 pb-6 text-sm font-semibold text-clay-600 transition-colors group-hover:text-clay-700">
                      View full profile
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </span>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

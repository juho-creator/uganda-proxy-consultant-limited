import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { MemberPhoto } from "@/components/team/team-sections";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership and engineering team at Proxy Consultants Ltd.",
};

// Read on each request so changes made in /admin show up immediately.
export const dynamic = "force-dynamic";

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
              return (
                <Reveal key={member.id} delay={index * 60}>
                  <article className="group relative flex h-full flex-col border border-ink-100 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-950/5">
                    <MemberPhoto member={member} className="w-full border-0 border-b" />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="font-display text-xs font-semibold uppercase tracking-widest text-clay-600">{member.title}</p>
                      <h2 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink-950">
                        <Link href={href} className="after:absolute after:inset-0">
                          {member.name}
                        </Link>
                      </h2>
                      {/* Spacer keeps "View full profile" aligned at the bottom of every card. */}
                      <div className="flex-1">
                        {(member.highlight || member.summary) && (
                          <p className="mt-3 text-sm leading-relaxed text-ink-600">{member.highlight || member.summary}</p>
                        )}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clay-600 transition-colors group-hover:text-clay-700">
                        View full profile
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                          &rarr;
                        </span>
                      </span>
                    </div>
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

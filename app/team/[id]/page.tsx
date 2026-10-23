import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import {
  ExperienceTimeline,
  FactGrid,
  ListBody,
  MemberPhoto,
  experienceOverview,
  sectionId,
} from "@/components/team/team-sections";
import { getTeamMember } from "@/lib/team";

// Read on each request so changes made in /admin show up immediately.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getTeamMember((await params).id);
  return member ? { title: `${member.name} – ${member.title}`, description: member.summary } : { title: "Team member not found" };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl">{children}</h2>;
}

export default async function TeamMemberPage({ params }: Props) {
  const member = await getTeamMember((await params).id);
  if (!member) notFound();

  const sections = [
    ...(member.bio.length ? [{ id: "background", label: "Background" }] : []),
    ...member.lists.map((list) => ({ id: sectionId(list.label), label: list.label })),
    ...(member.experience.length ? [{ id: "employment-record", label: "Employment record" }] : []),
  ];

  return (
    <>
      {/* Profile header */}
      <section className="border-b border-ink-100 bg-ink-50">
        <Container className="py-10 sm:py-14">
          <Link href="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition-colors hover:text-clay-600">
            <span aria-hidden="true">&larr;</span>
            Our Team
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-[14rem_1fr] md:gap-12">
            <MemberPhoto member={member} className="w-full max-w-[14rem] bg-white" />
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-clay-600">{member.title}</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">{member.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-700">{member.summary}</p>
              {member.facts.length > 0 && (
                <div className="mt-6 max-w-2xl">
                  <FactGrid facts={member.facts} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Profile body */}
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[13rem_1fr] lg:gap-16">
          {sections.length > 1 && (
            <nav aria-label="Profile sections" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="font-display text-xs font-semibold uppercase tracking-widest text-ink-400">On this page</p>
                <ul className="mt-3 space-y-1 border-l border-ink-100">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink-600 transition-colors hover:border-clay-500 hover:text-ink-950"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}

          <div className="min-w-0 max-w-3xl space-y-14">
            {member.bio.length > 0 && (
              <section id="background" className="scroll-mt-28">
                <SectionTitle>Background</SectionTitle>
                <div className="mt-5 space-y-4">
                  {member.bio.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-ink-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {member.lists.map((list) => (
              <section key={list.label} id={sectionId(list.label)} className="scroll-mt-28">
                <SectionTitle>{list.label}</SectionTitle>
                <div className="mt-5 border border-ink-100 bg-white p-5 sm:p-6">
                  <ListBody list={list} />
                </div>
              </section>
            ))}

            {member.experience.length > 0 && (
              <section id="employment-record" className="scroll-mt-28">
                <SectionTitle>Employment record</SectionTitle>
                <p className="mt-2 text-sm text-ink-500">
                  {experienceOverview(member.experience)}. Most recent first — open a position to see its scope and key activities.
                </p>
                <div className="mt-6">
                  <ExperienceTimeline entries={member.experience} />
                </div>
              </section>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Project } from "@/lib/content";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="border border-ink-100 bg-white p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="flex shrink-0 items-start lg:w-56">
          <span className="font-display text-4xl font-semibold text-ink-100 lg:text-5xl">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="flex-1">
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-clay-600">Client &mdash; {project.client}</p>
          <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-ink-950 sm:text-2xl">{project.title}</h3>
          <ul className="mt-5 space-y-2.5 border-t border-ink-100 pt-5">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

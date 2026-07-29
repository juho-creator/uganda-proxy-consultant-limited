import type { Service } from "@/lib/content";

export function ServiceCard({
  service,
  index,
  showBlurb = true,
}: {
  service: Service;
  index?: number;
  showBlurb?: boolean;
}) {
  return (
    <div className="group relative flex h-full flex-col border-2 border-ink-300 bg-white p-6 transition-colors hover:border-ink-500">
      {typeof index === "number" && (
        <span className="font-display text-xs font-semibold tabular-nums text-clay-500">{String(index + 1).padStart(2, "0")}</span>
      )}
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-950">{service.title}</h3>
      {showBlurb && <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.blurb}</p>}
      <span className="mt-4 block h-0.5 w-8 bg-clay-500 transition-all duration-300 group-hover:w-14" />
    </div>
  );
}

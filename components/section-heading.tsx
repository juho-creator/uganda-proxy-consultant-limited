import { clsx } from "clsx";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "dark", className }: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={clsx(
            "font-display text-sm font-semibold uppercase tracking-widest",
            tone === "dark" ? "text-clay-600" : "text-clay-300"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
          tone === "dark" ? "text-ink-950" : "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("mt-4 text-base leading-relaxed", tone === "dark" ? "text-ink-600" : "text-ink-200")}>{description}</p>
      )}
    </div>
  );
}

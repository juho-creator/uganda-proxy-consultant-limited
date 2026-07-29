type RouteMotifProps = {
  className?: string;
  variant?: "hero" | "divider" | "panel";
};

/**
 * Signature graphic element for the site: an abstracted road/contour line motif, evoking
 * route alignments on an engineering drawing. Reused sparingly across hero, dividers and
 * panels rather than introducing new decorative shapes per section.
 */
export function RouteMotif({ className, variant = "hero" }: RouteMotifProps) {
  if (variant === "divider") {
    return (
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M0 20 C 150 4, 300 36, 450 20 S 750 4, 900 20 S 1100 32, 1200 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1 9"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "panel") {
    return (
      <svg
        viewBox="0 0 400 400"
        className={className}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-20 340 C 100 300, 160 380, 280 320 S 420 260, 460 300" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M-20 280 C 90 240, 170 320, 300 250 S 430 200, 470 240" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <path d="M-20 220 C 80 190, 190 260, 320 190 S 440 150, 480 180" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <circle cx="280" cy="320" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1200 700"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M-40 560 C 160 480, 260 620, 460 520 S 760 380, 900 460 S 1140 420, 1260 340"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M-40 470 C 180 400, 300 520, 520 430 S 800 300, 960 380 S 1160 340, 1260 270"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <path
        d="M-40 640 C 140 590, 240 680, 420 610 S 700 520, 860 570 S 1120 540, 1260 480"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 8"
        opacity="0.4"
      />
      <circle cx="460" cy="520" r="4" fill="currentColor" opacity="0.6" />
      <circle cx="900" cy="460" r="4" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

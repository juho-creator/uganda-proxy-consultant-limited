import { Fragment } from "react";

// Labeled links written as [label](https://…), then bare URLs, email addresses and international
// phone numbers (e.g. "+256 772 877126").
const TOKEN_RE = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\+\d[\d\s-]{7,}\d)/g;
const LABELED_LINK_RE = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/;
const TRAILING_PUNCTUATION_RE = /[.,;:)]+$/;

const linkClass = "font-medium text-clay-600 underline decoration-clay-200 underline-offset-2 hover:text-clay-700";

function ExternalLink({ href, children, wrapAnywhere }: { href: string; children: React.ReactNode; wrapAnywhere?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={wrapAnywhere ? `${linkClass} break-all` : linkClass}>
      {children}
      <span aria-hidden="true"> &#8599;</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Renders plain text with labeled links, URLs, emails and phone numbers turned into links. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(TOKEN_RE);

  return (
    <>
      {parts.map((part, index) => {
        // split() with a capture group puts matches at odd indexes.
        if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;

        const labeled = part.match(LABELED_LINK_RE);
        if (labeled) {
          return (
            <ExternalLink key={index} href={labeled[2]}>
              {labeled[1]}
            </ExternalLink>
          );
        }

        const trailing = part.match(TRAILING_PUNCTUATION_RE)?.[0] ?? "";
        const token = trailing ? part.slice(0, -trailing.length) : part;
        if (token.startsWith("http")) {
          return (
            <Fragment key={index}>
              <ExternalLink href={token} wrapAnywhere>
                {token}
              </ExternalLink>
              {trailing}
            </Fragment>
          );
        }

        const href = token.includes("@") ? `mailto:${token}` : `tel:${token.replace(/[\s-]/g, "")}`;
        return (
          <Fragment key={index}>
            <a href={href} className={linkClass}>
              {token}
            </a>
            {trailing}
          </Fragment>
        );
      })}
    </>
  );
}

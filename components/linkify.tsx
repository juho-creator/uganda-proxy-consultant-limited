import { Fragment } from "react";

// URLs, email addresses and international phone numbers (e.g. "+256 772 877126").
const TOKEN_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\+\d[\d\s-]{7,}\d)/g;
const TRAILING_PUNCTUATION_RE = /[.,;:)]+$/;

const linkClass = "font-medium text-clay-600 underline decoration-clay-200 underline-offset-2 hover:text-clay-700 break-all";

/** Renders plain text with URLs, emails and phone numbers turned into links. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(TOKEN_RE);

  return (
    <>
      {parts.map((part, index) => {
        // split() with a capture group puts matches at odd indexes.
        if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;

        const trailing = part.match(TRAILING_PUNCTUATION_RE)?.[0] ?? "";
        const token = trailing ? part.slice(0, -trailing.length) : part;
        const href = token.startsWith("http")
          ? token
          : token.includes("@")
            ? `mailto:${token}`
            : `tel:${token.replace(/[\s-]/g, "")}`;
        const external = token.startsWith("http");

        return (
          <Fragment key={index}>
            <a href={href} className={linkClass} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {token}
            </a>
            {trailing}
          </Fragment>
        );
      })}
    </>
  );
}

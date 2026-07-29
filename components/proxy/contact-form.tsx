"use client";

import { FormEvent, useState } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/imme/imme-icons";
import { COMPANY } from "@/lib/proxy/company";

/**
 * Contact form for Proxy Consultants Ltd. No backend endpoint exists yet, so submission composes
 * a `mailto:` to COMPANY.email as a fallback delivery channel — swap `onSubmit` for an API call
 * once one is available, without touching the markup.
 */
interface ContactDraft {
  name: string;
  organization: string;
  email: string;
  message: string;
}

const EMPTY: ContactDraft = { name: "", organization: "", email: "", message: "" };

export function ContactForm() {
  const [draft, setDraft] = useState<ContactDraft>(EMPTY);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    if (!draft.email.trim() || !draft.message.trim() || !draft.name.trim()) {
      setStatus("error");
      setError("Name, email, and message are required.");
      return;
    }

    const subject = encodeURIComponent(`${COMPANY.name} enquiry from ${draft.name}`);
    const body = encodeURIComponent(
      [
        `Name: ${draft.name}`,
        `Organization: ${draft.organization || "—"}`,
        `Email: ${draft.email}`,
        "",
        draft.message,
      ].join("\n"),
    );
    if (typeof window !== "undefined") {
      window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    }
    setStatus("submitted");
  };

  if (status === "submitted") {
    return (
      <div className="rounded-imme border border-imme-green/30 bg-white p-8 text-center shadow-imme-card">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-imme-green/10 text-imme-green">
          <CheckCircleIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-imme-navy">Message ready to send.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-imme-muted">
          Your default mail client should have opened with a pre-filled message. If not, please email{" "}
          <a className="text-imme-navy underline" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setDraft(EMPTY);
            setStatus("idle");
          }}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-imme-navy hover:text-imme-amber"
        >
          Send another message
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-imme border border-imme-line bg-white p-6 shadow-imme-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required>
          <input
            type="text"
            value={draft.name}
            onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value }))}
            className="contact-input"
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Organization">
          <input
            type="text"
            value={draft.organization}
            onChange={(event) => setDraft((d) => ({ ...d, organization: event.target.value }))}
            className="contact-input"
            autoComplete="organization"
          />
        </Field>
      </div>
      <Field label="Email" required>
        <input
          type="email"
          value={draft.email}
          onChange={(event) => setDraft((d) => ({ ...d, email: event.target.value }))}
          className="contact-input"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Message" required>
        <textarea
          value={draft.message}
          onChange={(event) => setDraft((d) => ({ ...d, message: event.target.value }))}
          rows={6}
          className="contact-input min-h-[140px] resize-y"
          required
        />
      </Field>
      {error ? (
        <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-imme-muted">
          Required fields are marked. We respond from{" "}
          <a className="font-mono text-imme-navy underline" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          .
        </p>
        <button type="submit" className="imme-btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting…" : "Submit"}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      <style jsx>{`
        .contact-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--imme-line);
          background: #fff;
          padding: 0.65rem 0.9rem;
          font-size: 14px;
          line-height: 1.5;
          color: var(--imme-ink);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .contact-input:focus {
          outline: none;
          border-color: var(--imme-navy);
          box-shadow: 0 0 0 3px rgba(26, 45, 79, 0.15);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-imme-muted">
        {label}
        {required ? <span className="ml-1 text-imme-amber">*</span> : null}
      </span>
      {children}
    </label>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { clsx } from "clsx";

type Status = "idle" | "submitting" | "success" | "error";

/** Mount-triggered fade/scale-in, matching the `Reveal` component's motion language. */
function useEnter() {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return entered;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Request failed");
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessCard onReset={() => setStatus("idle")} />;
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={submitting}>
      <fieldset disabled={submitting} className="space-y-5 disabled:opacity-60">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink-800">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="mt-1.5 block w-full rounded-sm border-ink-200 text-ink-950 shadow-none focus:border-ink-500 focus:ring-ink-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 block w-full rounded-sm border-ink-200 text-ink-950 shadow-none focus:border-ink-500 focus:ring-ink-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="organisation" className="block text-sm font-medium text-ink-800">
            Organisation
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            className="mt-1.5 block w-full rounded-sm border-ink-200 text-ink-950 shadow-none focus:border-ink-500 focus:ring-ink-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-ink-800">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="mt-1.5 block w-full rounded-sm border-ink-200 text-ink-950 shadow-none focus:border-ink-500 focus:ring-ink-500"
          />
        </div>
      </fieldset>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-2.5 rounded-sm border border-clay-200 bg-clay-50 px-4 py-3">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-clay-600">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.516 2.63H3.72c-1.347 0-2.189-1.463-1.515-2.63L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium text-clay-700">
            {errorMessage ?? "Something went wrong sending your message."} Please try again or email us directly.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="relative inline-flex min-w-[10.5rem] items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-90"
      >
        {submitting && (
          <svg className="h-4 w-4 animate-spin text-white/80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
          </svg>
        )}
        <span>{submitting ? "Sending…" : "Send Message"}</span>
      </button>
    </form>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  const entered = useEnter();

  return (
    <div
      role="status"
      className={clsx(
        "flex flex-col items-center gap-4 rounded-sm border border-ink-100 bg-ink-50 px-8 py-12 text-center transition-all duration-500 ease-out",
        entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
    >
      <span
        className={clsx(
          "flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f4ec] text-[#1f7a4d] transition-transform duration-500 ease-out",
          entered ? "scale-100" : "scale-75"
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={entered ? 0 : 1}
            style={{ transition: "stroke-dashoffset 550ms ease-out 150ms" }}
          />
        </svg>
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-ink-950">Message sent.</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
          Thank you for getting in touch. We will respond to your enquiry as soon as possible.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 transition-colors hover:text-clay-600"
      >
        Send another message
        <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
}

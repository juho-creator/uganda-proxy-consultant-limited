"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { clsx } from "clsx";

export const inputClass =
  "mt-1.5 block w-full rounded-sm border-ink-200 text-ink-950 shadow-none focus:border-ink-500 focus:ring-ink-500";
export const labelClass = "block text-sm font-medium text-ink-800";
export const smallButtonClass =
  "rounded-sm border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-950 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40";

export function Field({ id, label, hint, children }: { id?: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      {id ? (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      ) : (
        <p className={labelClass}>{label}</p>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={clsx("h-4 w-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
    </svg>
  );
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-sm border border-clay-200 bg-clay-50 px-4 py-3 text-sm font-medium text-clay-700">
      {children}
    </p>
  );
}

/**
 * Sends an admin request and handles the shared outcomes: an expired session goes back to the
 * login page, errors are shown inline, and success runs `onSuccess`.
 */
export function useAdminRequest() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(url: string, init: RequestInit, onSuccess: () => void, { redirectOn401 = true } = {}) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(url, init);
      if (response.status === 401 && redirectOn401) {
        router.push("/admin/login");
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      onSuccess();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return { send, pending, error };
}

export function FormActions({ pending, submitLabel, children }: { pending: boolean; submitLabel: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-6">
      <div>{children}</div>
      <div className="flex gap-3">
        <Link
          href="/admin"
          className="rounded-sm border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-ink-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-sm bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {pending && <Spinner className="text-white/80" />}
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

/** Confirms, then deletes via the given endpoint. `redirectTo` navigates afterwards; otherwise the page refreshes. */
export function DeleteButton({
  endpoint,
  confirmMessage,
  label = "Delete",
  redirectTo,
  className,
}: {
  endpoint: string;
  confirmMessage: string;
  label?: string;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const { send, pending, error } = useAdminRequest();

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmMessage)) return;
          send(endpoint, { method: "DELETE" }, () => {
            if (redirectTo) router.push(redirectTo);
            router.refresh();
          });
        }}
        className={clsx(smallButtonClass, "text-clay-600 hover:bg-clay-50", className)}
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && <span className="text-xs font-medium text-clay-700">{error}</span>}
    </span>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Spinner, inputClass, useAdminRequest } from "./form-ui";

export function LoginForm() {
  const router = useRouter();
  const { send, pending, error } = useAdminRequest();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    send(
      "/api/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      },
      () => {
        router.push("/admin");
        router.refresh();
      },
      // A 401 here means wrong credentials, which should be shown rather than redirected.
      { redirectOn401: false }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset disabled={pending} className="space-y-5">
        <Field id="username" label="Username">
          <input id="username" name="username" type="text" required autoFocus autoComplete="username" className={inputClass} />
        </Field>
        <Field id="password" label="Password">
          <input id="password" name="password" type="password" required autoComplete="current-password" className={inputClass} />
        </Field>
      </fieldset>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {pending && <Spinner className="text-white/80" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

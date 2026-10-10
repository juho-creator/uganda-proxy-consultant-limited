"use client";

import { useRouter } from "next/navigation";
import { smallButtonClass, useAdminRequest } from "./form-ui";

export function LogoutButton() {
  const router = useRouter();
  const { send, pending } = useAdminRequest();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        send("/api/admin/logout", { method: "POST" }, () => {
          router.push("/admin/login");
          router.refresh();
        })
      }
      className={smallButtonClass}
    >
      {pending ? "Logging out…" : "Log out"}
    </button>
  );
}

/** Up/down buttons that reorder a team member on the public Team page. */
export function MoveButtons({ endpoint, canUp, canDown }: { endpoint: string; canUp: boolean; canDown: boolean }) {
  const router = useRouter();
  const { send, pending } = useAdminRequest();

  function move(offset: -1 | 1) {
    send(
      endpoint,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ move: offset }) },
      () => router.refresh()
    );
  }

  return (
    <span className="inline-flex gap-1.5">
      <button type="button" aria-label="Move up" disabled={pending || !canUp} onClick={() => move(-1)} className={smallButtonClass}>
        ↑
      </button>
      <button type="button" aria-label="Move down" disabled={pending || !canDown} onClick={() => move(1)} className={smallButtonClass}>
        ↓
      </button>
    </span>
  );
}

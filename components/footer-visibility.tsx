"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Individual team member profiles (/team/<id>) end at their content, without the site footer. */
function hidesFooter(pathname: string) {
  return /^\/team\/[^/]+\/?$/.test(pathname);
}

export function FooterVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return hidesFooter(pathname) ? null : <>{children}</>;
}

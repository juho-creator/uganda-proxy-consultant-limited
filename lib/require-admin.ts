import { redirect } from "next/navigation";
import { isAdminSession } from "./admin-auth";

/** For admin pages: sends visitors without a valid session to the login page. */
export async function requireAdmin() {
  if (!(await isAdminSession())) redirect("/admin/login");
}

"use client";

import { useRouter } from "next/navigation";
import { DeleteButton, ErrorMessage, Field, FormActions, inputClass, useAdminRequest } from "./form-ui";
import { ImagePicker } from "./image-picker";
import type { TeamMember } from "@/lib/team";

/** Add (no `member`) or edit a team member shown on the Our Team page. */
export function TeamForm({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const { send, pending, error } = useAdminRequest();
  const endpoint = member ? `/api/admin/team/${encodeURIComponent(member.id)}` : "/api/admin/team";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(endpoint, { method: member ? "PUT" : "POST", body: new FormData(event.currentTarget) }, () => {
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={pending} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="name" label="Name">
            <input id="name" name="name" type="text" required defaultValue={member?.name} className={inputClass} />
          </Field>
          <Field id="title" label="Job title">
            <input id="title" name="title" type="text" required defaultValue={member?.title} className={inputClass} />
          </Field>
        </div>

        <Field label="Photo">
          <ImagePicker name="photo" initialSrc={member?.photo} aspectClass="aspect-[4/5] max-w-[15rem]" />
        </Field>

        <Field id="summary" label="Summary" hint="One sentence introducing them, shown as the lead line.">
          <textarea id="summary" name="summary" required rows={2} defaultValue={member?.summary} className={inputClass} />
        </Field>

        <Field id="bio" label="Background" hint="Leave a blank line between paragraphs.">
          <textarea id="bio" name="bio" rows={8} defaultValue={member?.bio.join("\n\n")} className={inputClass} />
        </Field>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,16rem)_1fr]">
          <Field id="highlightsLabel" label="List heading" hint="For example “Key credentials”.">
            <input
              id="highlightsLabel"
              name="highlightsLabel"
              type="text"
              defaultValue={member?.highlightsLabel ?? "Key credentials"}
              className={inputClass}
            />
          </Field>
          <Field id="highlights" label="List items" hint="One item per line. Leave empty to hide the list.">
            <textarea id="highlights" name="highlights" rows={5} defaultValue={member?.highlights.join("\n")} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormActions pending={pending} submitLabel={member ? "Save changes" : "Add team member"}>
        {member && (
          <DeleteButton
            endpoint={endpoint}
            confirmMessage={`Remove ${member.name} from the team page? This cannot be undone.`}
            label="Remove member"
            redirectTo="/admin"
          />
        )}
      </FormActions>
    </form>
  );
}

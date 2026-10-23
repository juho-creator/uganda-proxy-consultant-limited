"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { DeleteButton, ErrorMessage, Field, FormActions, inputClass, smallButtonClass, useAdminRequest } from "./form-ui";
import { ExperienceEditor, fromEditableExperience, toEditableExperience, type EditableExperience } from "./experience-editor";
import { ImagePicker } from "./image-picker";
import type { TeamFact, TeamMember } from "@/lib/team";

/** A list being edited: items are kept as one-per-line text until the form is submitted. */
type EditableList = { key: number; label: string; items: string };

let nextListKey = 0;

function toEditableLists(member?: TeamMember): EditableList[] {
  if (!member) return [{ key: nextListKey++, label: "Key credentials", items: "" }];
  return member.lists.map((list) => ({ key: nextListKey++, label: list.label, items: list.items.join("\n") }));
}

/** Details are edited as "Label: value" lines. */
function factsToText(facts: TeamFact[]) {
  return facts.map((fact) => `${fact.label}: ${fact.value}`).join("\n");
}

function textToFacts(text: string): TeamFact[] {
  return text.split("\n").flatMap((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return [];
    return [{ label: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() }];
  });
}

/** Add (no `member`) or edit a team member shown on the Our Team page. */
export function TeamForm({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const { send, pending, error } = useAdminRequest();
  const [lists, setLists] = useState<EditableList[]>(() => toEditableLists(member));
  const [experience, setExperience] = useState<EditableExperience[]>(() => toEditableExperience(member?.experience ?? []));
  const endpoint = member ? `/api/admin/team/${encodeURIComponent(member.id)}` : "/api/admin/team";

  function updateList(key: number, changes: Partial<EditableList>) {
    setLists((current) => current.map((list) => (list.key === key ? { ...list, ...changes } : list)));
  }

  function moveList(index: number, offset: -1 | 1) {
    setLists((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("lists", JSON.stringify(lists.map((list) => ({ label: list.label, items: list.items.split("\n") }))));
    data.set("facts", JSON.stringify(textToFacts(String(data.get("factsText") ?? ""))));
    data.delete("factsText");
    data.set("experience", JSON.stringify(fromEditableExperience(experience)));
    send(endpoint, { method: member ? "PUT" : "POST", body: data }, () => {
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

        <Field
          id="factsText"
          label="Details"
          hint="One per line as “Label: value”, e.g. “Citizenship: Ugandan”. Emails, links and phone numbers become clickable."
        >
          <textarea id="factsText" name="factsText" rows={5} defaultValue={factsToText(member?.facts ?? [])} className={inputClass} />
        </Field>

        <Field id="summary" label="Summary" hint="One sentence introducing them, shown as the lead line.">
          <textarea id="summary" name="summary" required rows={2} defaultValue={member?.summary} className={inputClass} />
        </Field>

        <Field id="bio" label="Background" hint="Leave a blank line between paragraphs.">
          <textarea id="bio" name="bio" rows={8} defaultValue={member?.bio.join("\n\n")} className={inputClass} />
        </Field>

        <Field label="Lists" hint="Shown as panels under the background, e.g. Education or Professional memberships. Empty lists are hidden.">
          <div className="mt-1.5 space-y-3">
            {lists.map((list, index) => (
              <div key={list.key} className="border border-ink-100 bg-ink-50/60 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`list-label-${list.key}`} className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                      Heading
                    </label>
                    <input
                      id={`list-label-${list.key}`}
                      type="text"
                      value={list.label}
                      onChange={(event) => updateList(list.key, { label: event.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" aria-label="Move list up" disabled={index === 0} onClick={() => moveList(index, -1)} className={smallButtonClass}>
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move list down"
                      disabled={index === lists.length - 1}
                      onClick={() => moveList(index, 1)}
                      className={smallButtonClass}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setLists((current) => current.filter((item) => item.key !== list.key))}
                      className={clsx(smallButtonClass, "text-clay-600")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <label htmlFor={`list-items-${list.key}`} className="mt-3 block text-xs font-semibold uppercase tracking-widest text-ink-500">
                  Items <span className="font-normal normal-case tracking-normal">(one per line)</span>
                </label>
                <textarea
                  id={`list-items-${list.key}`}
                  rows={Math.min(Math.max(list.items.split("\n").length + 1, 3), 12)}
                  value={list.items}
                  onChange={(event) => updateList(list.key, { items: event.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLists((current) => [...current, { key: nextListKey++, label: "", items: "" }])}
              className={smallButtonClass}
            >
              + Add list
            </button>
          </div>
        </Field>

        <Field label="Work experience" hint="Most recent first. Shown as a scrollable timeline on the member's profile page.">
          <ExperienceEditor entries={experience} onChange={setExperience} />
        </Field>
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

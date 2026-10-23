"use client";

import { clsx } from "clsx";
import { inputClass, smallButtonClass } from "./form-ui";
import type { TeamExperience } from "@/lib/team";

/** An employment entry being edited; activities are kept as one-per-line text until submit. */
export type EditableExperience = Required<Omit<TeamExperience, "activities">> & { key: number; activities: string };

type TextField = Exclude<keyof EditableExperience, "key" | "activities" | "description">;

const FIELDS: { name: TextField; label: string; wide?: boolean }[] = [
  { name: "period", label: "Period" },
  { name: "position", label: "Position" },
  { name: "organization", label: "Organization" },
  { name: "country", label: "Country" },
  { name: "project", label: "Project", wide: true },
  { name: "client", label: "Client", wide: true },
  { name: "reference", label: "Reference", wide: true },
];

let nextKey = 0;

export function emptyExperience(): EditableExperience {
  return {
    key: nextKey++,
    period: "",
    position: "",
    organization: "",
    project: "",
    client: "",
    country: "",
    reference: "",
    description: "",
    activities: "",
  };
}

export function toEditableExperience(entries: TeamExperience[]): EditableExperience[] {
  return entries.map((entry) => ({ ...emptyExperience(), ...entry, activities: entry.activities.join("\n") }));
}

export function fromEditableExperience(entries: EditableExperience[]) {
  return entries.map(({ key: _key, activities, ...entry }) => ({ ...entry, activities: activities.split("\n") }));
}

const fieldLabelClass = "text-xs font-semibold uppercase tracking-widest text-ink-500";

/** Editor for a team member's employment record: collapsible entries that can be added, removed and reordered. */
export function ExperienceEditor({
  entries,
  onChange,
}: {
  entries: EditableExperience[];
  onChange: (entries: EditableExperience[]) => void;
}) {
  function update(key: number, changes: Partial<EditableExperience>) {
    onChange(entries.map((entry) => (entry.key === key ? { ...entry, ...changes } : entry)));
  }

  function move(index: number, offset: -1 | 1) {
    const next = [...entries];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  }

  return (
    <div className="mt-1.5 space-y-3">
      {entries.map((entry, index) => (
        <details key={entry.key} className="border border-ink-100 bg-ink-50/60" open={!entry.position && !entry.organization}>
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-4 py-3">
            <span className="min-w-0 text-sm">
              <span className="font-semibold text-ink-950">{entry.position || "New position"}</span>
              {entry.period && <span className="text-ink-500"> · {entry.period}</span>}
            </span>
            <span className="flex gap-1.5">
              <button type="button" aria-label="Move entry up" disabled={index === 0} onClick={() => move(index, -1)} className={smallButtonClass}>
                ↑
              </button>
              <button
                type="button"
                aria-label="Move entry down"
                disabled={index === entries.length - 1}
                onClick={() => move(index, 1)}
                className={smallButtonClass}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(entries.filter((item) => item.key !== entry.key))}
                className={clsx(smallButtonClass, "text-clay-600")}
              >
                Remove
              </button>
            </span>
          </summary>

          <div className="grid gap-4 border-t border-ink-100 p-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.name} className={field.wide ? "sm:col-span-2" : undefined}>
                <label htmlFor={`exp-${field.name}-${entry.key}`} className={fieldLabelClass}>
                  {field.label}
                </label>
                <input
                  id={`exp-${field.name}-${entry.key}`}
                  type="text"
                  value={entry[field.name]}
                  onChange={(event) => update(entry.key, { [field.name]: event.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor={`exp-description-${entry.key}`} className={fieldLabelClass}>
                Description
              </label>
              <textarea
                id={`exp-description-${entry.key}`}
                rows={3}
                value={entry.description}
                onChange={(event) => update(entry.key, { description: event.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`exp-activities-${entry.key}`} className={fieldLabelClass}>
                Activities <span className="font-normal normal-case tracking-normal">(one per line)</span>
              </label>
              <textarea
                id={`exp-activities-${entry.key}`}
                rows={Math.min(Math.max(entry.activities.split("\n").length + 1, 3), 10)}
                value={entry.activities}
                onChange={(event) => update(entry.key, { activities: event.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </details>
      ))}
      <button type="button" onClick={() => onChange([...entries, emptyExperience()])} className={smallButtonClass}>
        + Add position
      </button>
    </div>
  );
}

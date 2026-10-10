"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { clsx } from "clsx";
import { ArticleBodyEditor, type BodyEditorHandle } from "../article-body-editor";
import { DeleteButton, ErrorMessage, Field, FormActions, inputClass, useAdminRequest } from "./form-ui";
import { ImagePicker } from "./image-picker";
import { isIsoDate, todayIsoDate } from "@/lib/article-date";
import type { Article } from "@/lib/news";

/** Create (no `article`) or edit an article: text, calendar date, thumbnail and inline-image body. */
export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const bodyEditorRef = useRef<BodyEditorHandle>(null);
  const { send, pending, error } = useAdminRequest();
  const endpoint = article ? `/api/admin/news/${encodeURIComponent(article.id)}` : "/api/admin/news";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { blocks, uploads } = bodyEditorRef.current!.serialize();
    uploads.forEach((file, field) => data.set(field, file));
    data.set("body", JSON.stringify(blocks));

    send(endpoint, { method: article ? "PUT" : "POST", body: data }, () => {
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={pending} className="space-y-6">
        <Field id="title" label="Title">
          <input id="title" name="title" type="text" required defaultValue={article?.title} className={inputClass} />
        </Field>

        <Field id="date" label="Date">
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={article && isIsoDate(article.date) ? article.date : todayIsoDate()}
            // Open the calendar from anywhere in the field, not just the small icon.
            onClick={(event) => {
              try {
                event.currentTarget.showPicker?.();
              } catch {
                // showPicker is unavailable in some browsers; the native control still works.
              }
            }}
            className={clsx(inputClass, "max-w-xs cursor-pointer")}
          />
        </Field>

        <Field id="excerpt" label="Summary" hint="Shown on the news card and at the top of the article.">
          <textarea id="excerpt" name="excerpt" required rows={3} defaultValue={article?.excerpt} className={inputClass} />
        </Field>

        <Field label="Thumbnail">
          <ImagePicker name="thumbnail" initialSrc={article?.thumbnail} />
        </Field>

        <Field label="Article content">
          <ArticleBodyEditor ref={bodyEditorRef} initial={article?.body ?? []} />
        </Field>
      </fieldset>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormActions pending={pending} submitLabel={article ? "Save changes" : "Publish article"}>
        {article && (
          <DeleteButton
            endpoint={endpoint}
            confirmMessage={`Delete "${article.title}" and its images? This cannot be undone.`}
            label="Delete article"
            redirectTo="/admin"
          />
        )}
      </FormActions>
    </form>
  );
}

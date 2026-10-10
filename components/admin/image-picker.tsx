"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { smallButtonClass } from "./form-ui";

const ACCEPTED_IMAGES = "image/png,image/jpeg,image/gif,image/webp";

/**
 * Image field for admin forms. Submits as part of the surrounding <form>: the chosen file under
 * `name`, plus `<name>Action` (keep | remove | replace) telling the API what to do.
 */
export function ImagePicker({
  name,
  initialSrc,
  aspectClass = "aspect-[16/10]",
}: {
  name: string;
  initialSrc?: string;
  aspectClass?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialSrc ?? null);
  const [action, setAction] = useState<"keep" | "remove" | "replace">("keep");
  const id = `${name}-picker`;

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function remove() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setAction("remove");
  }

  return (
    <div className="mt-1.5 max-w-md">
      <input type="hidden" name={`${name}Action`} value={action} />
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={ACCEPTED_IMAGES}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setPreview(URL.createObjectURL(file));
          setAction("replace");
        }}
      />

      {preview ? (
        <>
          <div className={clsx("overflow-hidden border border-ink-100 bg-ink-50", aspectClass)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- local previews and our own uploaded images */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="mt-2 flex gap-2">
            <label htmlFor={id} className={clsx(smallButtonClass, "cursor-pointer")}>
              Replace
            </label>
            <button type="button" onClick={remove} className={clsx(smallButtonClass, "text-clay-600")}>
              Remove
            </button>
          </div>
        </>
      ) : (
        <label
          htmlFor={id}
          className={clsx(
            "flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-ink-200 bg-white px-4 text-center transition-colors hover:border-ink-400",
            aspectClass
          )}
        >
          <span className="text-sm font-semibold text-ink-950">Choose an image</span>
          <span className="text-xs text-ink-500">PNG, JPEG, GIF or WebP, up to 5 MB</span>
        </label>
      )}
    </div>
  );
}

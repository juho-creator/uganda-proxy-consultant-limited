"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import type { ArticleBlock } from "@/lib/news";

/** Body as sent to the API: new images name a `file-N` form field, existing ones keep their `src`. */
export type OutgoingBlock = { type: "paragraph"; text: string } | { type: "image"; src?: string; upload?: string };

export type BodyEditorHandle = {
  serialize: () => { blocks: OutgoingBlock[]; uploads: Map<string, File> };
};

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
const STORED_IMAGE_PREFIX = "/api/images/";
const BLOCK_TAGS = new Set([
  "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "UL", "OL", "BLOCKQUOTE", "PRE", "FIGURE", "SECTION", "ARTICLE", "TABLE", "TR",
]);

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toHtml(blocks: ArticleBlock[]) {
  if (blocks.length === 0) return "<p><br></p>";
  const html = blocks
    .map((block) =>
      block.type === "paragraph"
        ? `<p>${escapeHtml(block.text).replace(/\n/g, "<br>")}</p>`
        : `<p><img src="${escapeHtml(block.src)}" alt=""></p>`
    )
    .join("");
  // Always leave an empty line after a trailing image so there is somewhere to keep typing.
  return blocks[blocks.length - 1].type === "image" ? `${html}<p><br></p>` : html;
}

function rangeFromPoint(x: number, y: number): Range | null {
  if (document.caretRangeFromPoint) return document.caretRangeFromPoint(x, y);
  // Firefox
  const position = (
    document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null }
  ).caretPositionFromPoint?.(x, y);
  if (!position) return null;
  const range = document.createRange();
  range.setStart(position.offsetNode, position.offset);
  range.collapse(true);
  return range;
}

/**
 * One continuous writing area for the article body: type text (Enter starts a new paragraph) and
 * place images inline at the cursor via the toolbar, paste, or drag and drop. The content is
 * converted back to plain paragraphs and images on save, so no HTML is ever stored.
 */
export function ArticleBodyEditor({ initial, ref }: { initial: ArticleBlock[]; ref: Ref<BodyEditorHandle> }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Local preview URL → the file it shows, for images not uploaded yet. */
  const pendingFiles = useRef(new Map<string, File>());
  /** Last cursor position inside the editor, restored when the toolbar button steals focus. */
  const savedRange = useRef<Range | null>(null);
  const [empty, setEmpty] = useState(initial.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const editor = editorRef.current!;
    const files = pendingFiles.current;
    // Set once rather than rendered by React, which must not reconcile a contentEditable region.
    editor.innerHTML = toHtml(initial);

    function handleSelectionChange() {
      const selection = window.getSelection();
      if (selection?.rangeCount && editor.contains(selection.getRangeAt(0).startContainer)) {
        savedRange.current = selection.getRangeAt(0).cloneRange();
      }
    }
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      files.forEach((_, url) => URL.revokeObjectURL(url));
    };
    // Only the initial content matters; later edits live in the DOM.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateEmpty() {
    const editor = editorRef.current!;
    setEmpty(!editor.textContent?.trim() && !editor.querySelector("img"));
  }

  function insertImages(fileList: FileList | File[], at?: Range | null) {
    const files = Array.from(fileList);
    const rejected = files.filter((file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_BYTES);
    const accepted = files.filter((file) => !rejected.includes(file));
    setError(rejected.length ? `Skipped ${rejected.map((file) => `"${file.name}"`).join(", ")}: use PNG, JPEG, GIF or WebP up to 5 MB.` : null);
    if (accepted.length === 0) return;

    const editor = editorRef.current!;
    editor.focus();
    const selection = window.getSelection()!;
    const range = at ?? savedRange.current;
    selection.removeAllRanges();
    if (range && editor.contains(range.startContainer)) {
      selection.addRange(range);
    } else {
      const end = document.createRange();
      end.selectNodeContents(editor);
      end.collapse(false);
      selection.addRange(end);
    }

    const html = accepted
      .map((file) => {
        const url = URL.createObjectURL(file);
        pendingFiles.current.set(url, file);
        return `<p><img src="${url}" alt=""></p>`;
      })
      .join("");
    document.execCommand("insertHTML", false, `${html}<p><br></p>`);
    updateEmpty();
  }

  useImperativeHandle(ref, () => ({
    serialize() {
      const blocks: OutgoingBlock[] = [];
      const uploads = new Map<string, File>();
      let text = "";

      const flush = () => {
        const paragraph = text.replace(/ /g, " ").trim();
        if (paragraph) blocks.push({ type: "paragraph", text: paragraph });
        text = "";
      };

      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent ?? "";
          return;
        }
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "IMG") {
          flush();
          const src = node.getAttribute("src") ?? "";
          const file = pendingFiles.current.get(src);
          if (file) {
            const field = `file-${uploads.size}`;
            uploads.set(field, file);
            blocks.push({ type: "image", upload: field });
          } else if (src.startsWith(STORED_IMAGE_PREFIX)) {
            blocks.push({ type: "image", src });
          }
          return;
        }
        if (node.tagName === "BR") {
          text += "\n";
          return;
        }
        const isBlock = BLOCK_TAGS.has(node.tagName);
        if (isBlock) flush();
        node.childNodes.forEach(walk);
        if (isBlock) flush();
      };

      editorRef.current!.childNodes.forEach(walk);
      flush();
      return { blocks, uploads };
    },
  }));

  return (
    <div className="mt-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-sm border border-b-0 border-ink-200 bg-ink-50 px-3 py-2">
        <button
          type="button"
          // Keep the cursor where it is in the editor when clicking the button.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-sm border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-950 transition-colors hover:border-ink-400"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
            <rect x="2.5" y="3.5" width="15" height="13" />
            <circle cx="7" cy="8" r="1.5" />
            <path d="M3 15l4.5-4.5 3 3 2.5-2.5 4 4" />
          </svg>
          Insert image
        </button>
        <span className="text-xs text-ink-500">Enter for a new paragraph · paste or drop images anywhere</span>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            if (event.target.files?.length) insertImages(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <div className="relative">
        {empty && (
          <p className="pointer-events-none absolute left-4 top-3 text-base text-ink-400" aria-hidden="true">
            Write the full article here…
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Article content"
          onInput={updateEmpty}
          onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
          onPaste={(event) => {
            event.preventDefault();
            if (event.clipboardData.files.length) {
              insertImages(event.clipboardData.files);
            } else {
              // Paste as plain text so formatting from other sites/apps doesn't come along.
              document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
            }
          }}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes("Files")) event.preventDefault();
          }}
          onDrop={(event) => {
            if (!event.dataTransfer.files.length) return;
            event.preventDefault();
            insertImages(event.dataTransfer.files, rangeFromPoint(event.clientX, event.clientY));
          }}
          className="min-h-64 max-h-[55vh] overflow-y-auto rounded-b-sm border border-ink-200 bg-white px-4 py-3 text-base leading-relaxed text-ink-950 focus:border-ink-500 focus:outline-none focus:ring-1 focus:ring-ink-500 [&_img]:my-1 [&_img]:block [&_img]:max-h-80 [&_img]:max-w-full [&_img]:border [&_img]:border-ink-100 [&_p+p]:mt-3"
        />
      </div>

      {error && <p className="mt-2 text-xs font-medium text-clay-700">{error}</p>}
    </div>
  );
}

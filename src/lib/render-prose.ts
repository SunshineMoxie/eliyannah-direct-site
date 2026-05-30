// Shared rendering for the structured collections (scenes, press, craft).
//
// Authoring conventions, all human-easy and consistent with the status panels:
//   *word*            -> emerald italic   (the site's emphasis motif)
//   [text](https://…) -> a link
//   blank line        -> new paragraph    (block fields only)
//   single newline    -> line break
//
// PLACEHOLDER PROMPTS:
//   If a field's text begins with "PROMPT:" it renders inside the yellow
//   placeholder box exactly like the current site, instead of as real copy.
//   To turn a prompt into real content, delete the "PROMPT:" prefix and write.
//   This is how the existing yellow prompt scaffolding is preserved now that
//   the text lives in editable fields.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function applyInline(escaped: string): string {
  // links: [text](url) — only http(s) and mailto allowed
  let out = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    '<a href="$2">$1</a>'
  );
  // emphasis: *word*
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

const PROMPT_PREFIX = /^\s*PROMPT:\s*/;

export function isPrompt(value: unknown): boolean {
  return typeof value === "string" && PROMPT_PREFIX.test(value);
}

// Inline field (titles, taglines, one-liners).
// Returns { html, isPrompt }. When it's a prompt, html is the inner text only;
// the page wraps it in the <span class="prompt"> box.
export function renderInline(value: unknown): { html: string; prompt: boolean } {
  if (typeof value !== "string" || value.length === 0) {
    return { html: "", prompt: false };
  }
  if (PROMPT_PREFIX.test(value)) {
    return { html: escapeHtml(value.replace(PROMPT_PREFIX, "")), prompt: true };
  }
  let out = escapeHtml(value);
  out = applyInline(out);
  out = out.replace(/\r?\n/g, "<br>");
  return { html: out, prompt: false };
}

// Block field (synopsis, craft body). Splits on blank lines into <p>…</p>.
// Returns { html, isPrompt } the same way.
export function renderProse(value: unknown): { html: string; prompt: boolean } {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { html: "", prompt: false };
  }
  if (PROMPT_PREFIX.test(value)) {
    return { html: escapeHtml(value.replace(PROMPT_PREFIX, "")), prompt: true };
  }
  const paragraphs = value
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((para) => {
      let p = escapeHtml(para.trim());
      p = applyInline(p);
      p = p.replace(/\r?\n/g, "<br>");
      return `<p>${p}</p>`;
    });
  return { html: paragraphs.join("\n"), prompt: false };
}

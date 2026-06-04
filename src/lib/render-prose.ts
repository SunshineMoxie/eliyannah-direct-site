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
//   Formatting is deliberately OFF inside a prompt — it's a note to self.
//   To turn a prompt into real content, delete the "PROMPT:" prefix and write.
//
// CALLOUT BOXES:
//   If a field's text begins with "BOX:" it renders inside the same yellow
//   frame, but as real, fully formatted copy: paragraphs, *italics*, links,
//   in normal body type. Use it to spotlight finished copy. PROMPT is for
//   placeholders; BOX is for copy you want framed.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function applyInline(escaped: string): string {
  // links: [text](url) — only http(s) and mailto allowed.
  // External http(s) links open in a new tab; mailto and internal links don't.
  let out = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (_m, text, url) => {
      const external = /^https?:\/\//.test(url);
      const attrs = external ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${url}"${attrs}>${text}</a>`;
    }
  );
  // emphasis: *word*
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

const PROMPT_PREFIX = /^\s*PROMPT:\s*/;
const BOX_PREFIX = /^\s*BOX:\s*/;

// The BOX variant reuses the .prompt class for the yellow frame (background,
// left border, padding) and neutralises the placeholder typography inline, so
// no CSS changes are needed anywhere and every page picks this up for free.
const BOX_STYLE =
  "font-family: var(--font-body); font-size: 1rem; font-weight: 400; " +
  "letter-spacing: 0; text-transform: none; color: var(--ink-soft); line-height: 1.6;";

export function isPrompt(value: unknown): boolean {
  return typeof value === "string" && PROMPT_PREFIX.test(value);
}

// Inline field (titles, taglines, one-liners).
// Returns { html, isPrompt }. When it's a prompt, html is the inner text only;
// the page wraps it in the <span class="prompt"> box. When it's a BOX, the
// html arrives already wrapped, fully formatted, with prompt:false so pages
// don't wrap it again.
export function renderInline(value: unknown): { html: string; prompt: boolean } {
  if (typeof value !== "string" || value.length === 0) {
    return { html: "", prompt: false };
  }
  if (PROMPT_PREFIX.test(value)) {
    return { html: escapeHtml(value.replace(PROMPT_PREFIX, "")), prompt: true };
  }
  if (BOX_PREFIX.test(value)) {
    let out = escapeHtml(value.replace(BOX_PREFIX, ""));
    out = applyInline(out);
    out = out.replace(/\r?\n/g, "<br>");
    return {
      html: `<span class="prompt" style="${BOX_STYLE}">${out}</span>`,
      prompt: false,
    };
  }
  let out = escapeHtml(value);
  out = applyInline(out);
  out = out.replace(/\r?\n/g, "<br>");
  return { html: out, prompt: false };
}

// Block field (synopsis, craft body). Splits on blank lines into <p>…</p>.
// Returns { html, isPrompt } the same way. BOX fields come back as a single
// yellow-framed block containing the formatted paragraphs.
export function renderProse(value: unknown): { html: string; prompt: boolean } {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { html: "", prompt: false };
  }
  if (PROMPT_PREFIX.test(value)) {
    return { html: escapeHtml(value.replace(PROMPT_PREFIX, "")), prompt: true };
  }
  const boxed = BOX_PREFIX.test(value);
  const source = boxed ? value.replace(BOX_PREFIX, "") : value;
  const paragraphs = source
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((para, i) => {
      let p = escapeHtml(para.trim());
      p = applyInline(p);
      p = p.replace(/\r?\n/g, "<br>");
      const spacing = boxed && i > 0 ? ' style="margin-top: 0.75rem"' : "";
      return `<p${spacing}>${p}</p>`;
    });
  const inner = paragraphs.join("\n");
  if (boxed) {
    return {
      html: `<div class="prompt" style="${BOX_STYLE}">${inner}</div>`,
      prompt: false,
    };
  }
  return { html: inner, prompt: false };
}

// Decide how a link should open. External http(s) links open in a new tab;
// internal paths (/press) and mailto: stay in the same tab. Returns the
// attributes string to drop into an <a> tag, or "" for same-tab.
export function linkTarget(href: unknown): string {
  return typeof href === "string" && /^https?:\/\//.test(href)
    ? ' target="_blank" rel="noopener"'
    : "";
}

// Renders a short status-panel value string to safe HTML.
//
// Two optional authoring conventions, both meant to be human-easy:
//   *word*   -> emerald italic (the site's emphasis motif)
//   newline  -> line break (just press Enter in the editor)
//
// Everything else is HTML-escaped first, so a stray "<" or "&" in the text
// can never break the page layout. We escape the user's text, THEN add our
// own <em> and <br> tags, so only the intended formatting survives.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderPanelValue(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) return '';
  let out = escapeHtml(input);
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>'); // *italic*
  out = out.replace(/\r?\n/g, '<br>'); // line breaks
  return out;
}

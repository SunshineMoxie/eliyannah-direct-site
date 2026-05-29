import Markdoc from '@markdoc/markdoc';

// Keystatic stores the `body` (a fields.markdoc field) as Markdoc and hands it
// back through the Reader API as an AST node. Keystatic does NOT render it for
// you. We transform that node and render it to an HTML string, which the page
// drops into `.dailies-entry-body` via set:html.
//
// WATCH POINT (the one thing most likely to need a nudge on first run):
// depending on the installed @keystatic/core version, the resolved value of
// `await entry.body()` is either the AST node directly, or wrapped as
// `{ node }`. We handle both. If you ever see empty bodies, log the resolved
// value here first.
export function renderMarkdoc(content: unknown): string {
  if (!content) return '';
  const ast = (content as any)?.node ?? content;
  const transformed = Markdoc.transform(ast as any);
  return Markdoc.renderers.html(transformed);
}

import { config, fields, collection } from '@keystatic/core';

// ITERATION A — pilot scope, GitHub mode.
// Storage is GitHub, so the editor lives on your live site at /keystatic and
// saves commit straight to this repo. No local setup, no terminal.
// Only the Dailies collection is defined here. Iterations B and C add the rest.

export default config({
  storage: {
    kind: 'github',
    repo: 'SunshineMoxie/eliyannah-direct-site',
  },
  ui: {
    brand: { name: 'Sunshine Moxie' },
  },
  collections: {
    dailies: collection({
      label: 'Dailies',
      slugField: 'title',
      path: 'src/content/dailies/*',
      // The body lives in the same file, below the frontmatter.
      format: { contentField: 'body' },
      // Put the writing surface front and center in the editor.
      entryLayout: 'content',
      // What you see in the entry list inside /keystatic.
      columns: ['title', 'entryNumber', 'dateLine'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'Clean title text. This also generates the URL slug / filename.',
          },
        }),
        entryNumber: fields.text({
          label: 'Entry number',
          description: 'Zero-padded, e.g. 001. Entries display in ascending order by this value.',
        }),
        location: fields.text({
          label: 'Location',
          defaultValue: 'Chicago',
        }),
        dateLine: fields.text({
          label: 'Date line',
          description: 'Free text. e.g. "April 2026" or "Coming Soon".',
        }),
        body: fields.markdoc({
          label: 'Body',
        }),
      },
    }),
  },
});

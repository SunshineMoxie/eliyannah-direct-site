import { config, fields, collection, singleton } from '@keystatic/core';

// GitHub mode. Editor lives at /keystatic on the live site; saves commit here.
//
// Iteration A: dailies (collection) — proven.
// Iteration B, step 1: callSheetStatus (singleton) — the four landing-page panels.

export default config({
  storage: {
    kind: 'github',
    repo: 'SunshineMoxie/eliyannah-direct-site',
  },
  ui: {
    brand: { name: 'Sunshine Moxie' },
    // Group the editor sidebar so it stays readable as we add more.
    navigation: {
      'Landing page': ['callSheetStatus'],
      Writing: ['dailies'],
    },
  },

  collections: {
    dailies: collection({
      label: 'Dailies',
      slugField: 'title',
      path: 'src/content/dailies/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
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
        location: fields.text({ label: 'Location', defaultValue: 'Chicago' }),
        dateLine: fields.text({
          label: 'Date line',
          description: 'Free text. e.g. "April 2026" or "Coming Soon".',
        }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
  },

  singletons: {
    callSheetStatus: singleton({
      label: 'Call Sheet status panels',
      // Stored as src/content/call-sheet-status.yaml
      path: 'src/content/call-sheet-status',
      schema: {
        panels: fields.array(
          fields.object({
            label: fields.text({
              label: 'Small label (top of panel)',
              description: 'The little uppercase line. e.g. "Current Production".',
            }),
            value: fields.text({
              label: 'Big value',
              description:
                'The large text. Press Enter for a line break. Wrap a word in *asterisks* to make it emerald italic, e.g. From The *Forest*.',
              multiline: true,
            }),
            sub: fields.text({
              label: 'Sub line (bottom of panel)',
              description: 'The small line underneath. e.g. "Feature · In Development".',
            }),
            highlight: fields.checkbox({
              label: 'Highlight this panel yellow',
              description: 'Turns the panel Kodak yellow. Designed for one panel at a time.',
              defaultValue: false,
            }),
          }),
          {
            label: 'Panels',
            description:
              'The four boxes under your name. The layout is designed for four. Adding or removing still works, but four looks best.',
            itemLabel: (props) => props.fields.label.value || 'Panel',
          }
        ),
      },
    }),
  },
});

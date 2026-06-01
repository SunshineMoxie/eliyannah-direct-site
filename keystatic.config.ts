import { config, fields, collection, singleton } from '@keystatic/core';

// GitHub mode. Editor lives at /keystatic on the live site; saves commit here.
//
// Proven: dailies (collection), callSheetStatus (singleton).
// This batch adds three structured collections: scenes, press, craft.
// They store as YAML data files (no Markdoc body), rendered with the helpers
// in src/lib/render-prose.ts using the *asterisk*, [link](url), and PROMPT:
// conventions.

const linkField = (label: string) =>
  fields.text({ label, description: 'A URL, a path like /press, or # for a placeholder link.' });

export default config({
  storage: {
    kind: 'github',
    repo: 'SunshineMoxie/eliyannah-direct-site',
  },
  ui: {
    brand: { name: 'Sunshine Moxie' },
    navigation: {
      'Landing page': ['callSheetStatus'],
      Work: ['scenes'],
      Press: ['press'],
      'Craft Services': ['craft'],
      'The Forest': ['forest'],
      Contact: ['contact'],
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

    scenes: collection({
      label: 'Scenes / Work',
      slugField: 'title',
      path: 'src/content/scenes/*',
      format: { data: 'yaml' },
      columns: ['title', 'sceneNumber'],
      schema: {
        sceneNumber: fields.text({
          label: 'Scene number',
          description: 'Zero-padded, e.g. 01. Scenes display in ascending order by this value.',
        }),
        title: fields.slug({
          name: {
            label: 'Title',
            description:
              'Wrap a word in *asterisks* for emerald italic, e.g. *The Caterpillar* and *The Butterfly*.',
          },
        }),
        slugline: fields.text({
          label: 'Slugline',
          description: 'The mono line above the title. e.g. "INT. Chicago — 2026 — Day · Feature · In Development".',
        }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'One line under the title. *asterisks* for italic. Start with "PROMPT:" to show the yellow placeholder box.',
          multiline: true,
        }),
        synopsis: fields.text({
          label: 'Synopsis',
          description: 'Blank line between paragraphs. *asterisks* for italic. [text](url) for links. Start with "PROMPT:" for the placeholder box.',
          multiline: true,
        }),
        actions: fields.array(
          fields.object({
            label: fields.text({ label: 'Button label' }),
            href: linkField('Link'),
            primary: fields.checkbox({ label: 'Primary (filled) button', defaultValue: false }),
          }),
          { label: 'Action buttons', itemLabel: (p) => p.fields.label.value || 'Button' }
        ),
        meta: fields.array(
          fields.object({
            key: fields.text({ label: 'Label' }),
            value: fields.text({ label: 'Value', description: '*asterisks* for emerald italic.' }),
          }),
          { label: 'Meta rows (right column)', itemLabel: (p) => p.fields.key.value || 'Row' }
        ),
      },
    }),

    press: collection({
      label: 'Press',
      slugField: 'title',
      path: 'src/content/press/*',
      format: { data: 'yaml' },
      columns: ['title', 'outlet', 'category'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Headline / what was said',
            description: 'The article title or interview name. Shown in the big italic line on the card.',
          },
        }),
        outlet: fields.text({ label: 'Outlet', description: 'e.g. "Los Angeles Times".' }),
        date: fields.text({ label: 'Date', description: 'Free text. e.g. "September 2018" or "2017".' }),
        project: fields.text({ label: 'Project', description: 'e.g. "Re: Hermione Granger and the Quarter Life Crisis".' }),
        link: linkField('Link to coverage'),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Print', value: 'Print' },
            { label: 'Video', value: 'Video' },
            { label: 'Audio', value: 'Audio' },
            { label: 'Appearances', value: 'Appearances' },
          ],
          defaultValue: 'Print',
        }),
        sortOrder: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first within a category. Leave gaps (10, 20, 30) so you can slot things between later.',
          defaultValue: 100,
        }),
      },
    }),

    craft: collection({
      label: 'Craft Services',
      slugField: 'title',
      path: 'src/content/craft/*',
      format: { data: 'yaml' },
      columns: ['title', 'number'],
      schema: {
        number: fields.text({
          label: 'Number',
          description: 'Zero-padded, e.g. 01. Items display in ascending order by this value.',
        }),
        label: fields.text({ label: 'Small label', description: 'e.g. "The Recipe".' }),
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The big line. *asterisks* for emerald italic.',
          },
        }),
        body: fields.text({
          label: 'Body',
          description: 'Blank line between paragraphs. *asterisks* for italic. [text](url) for links. Start with "PROMPT:" for the yellow placeholder box.',
          multiline: true,
        }),
      },
    }),
  },

  singletons: {
    callSheetStatus: singleton({
      label: 'Call Sheet status panels',
      path: 'src/content/call-sheet-status',
      schema: {
        panels: fields.array(
          fields.object({
            label: fields.text({ label: 'Small label (top of panel)' }),
            value: fields.text({ label: 'Big value', multiline: true,
              description: 'Press Enter for a line break. *asterisks* for emerald italic.' }),
            sub: fields.text({ label: 'Sub line (bottom of panel)' }),
            highlight: fields.checkbox({ label: 'Highlight this panel yellow', defaultValue: false }),
          }),
          { label: 'Panels', itemLabel: (p) => p.fields.label.value || 'Panel' }
        ),
      },
    }),

    contact: singleton({
      label: 'Contact page',
      path: 'src/content/contact',
      schema: {
        title: fields.text({
          label: 'Page title',
          description: 'The big heading. *asterisks* for emerald italic, e.g. Hit *Me* Up.',
        }),
        subtitle: fields.text({
          label: 'Subtitle',
          description: 'The line under the title.',
          multiline: true,
        }),
        lead: fields.text({
          label: 'Lead line',
          description: 'The italic intro sentence. *asterisks* for emerald italic.',
          multiline: true,
        }),
        blocks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', description: 'e.g. "Direct", "Representation".' }),
            value: fields.text({
              label: 'Value',
              description: 'The big line. If a Link is set, this becomes the clickable text.',
              multiline: true,
            }),
            link: fields.text({
              label: 'Link (optional)',
              description: 'Leave blank for plain text (e.g. the representation status). Use mailto:you@… for email, /press for an internal page, or a full https:// URL. External links open in a new tab.',
            }),
            note: fields.text({ label: 'Small note underneath', multiline: true }),
            highlight: fields.checkbox({
              label: 'Highlight this block yellow',
              description: 'Designed for one block at a time.',
              defaultValue: false,
            }),
          }),
          { label: 'Contact blocks', itemLabel: (p) => p.fields.label.value || 'Block' }
        ),
        socialLabel: fields.text({ label: 'Social section heading', defaultValue: 'Elsewhere on the Internet' }),
        socialSub: fields.text({ label: 'Social section sub-label', defaultValue: 'Follow / Watch / Read' }),
        socials: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform', description: 'e.g. "Instagram".' }),
            handle: fields.text({ label: 'Handle / display text', description: 'e.g. "@eliyannahdirect".' }),
            link: fields.text({
              label: 'Link',
              description: 'Full https:// URL. Leave blank to show as text with no link (e.g. a site not live yet). External links open in a new tab.',
            }),
          }),
          { label: 'Social links', itemLabel: (p) => p.fields.platform.value || 'Link' }
        ),
      },
    }),

    forest: singleton({
      label: 'The Forest page',
      path: 'src/content/forest',
      schema: {
        title: fields.text({ label: 'Page title', description: '*asterisks* for emerald italic.' }),
        subtitle: fields.text({ label: 'Subtitle', multiline: true }),
        intro: fields.text({
          label: 'Intro paragraphs',
          description: 'Blank line between paragraphs. *asterisks* for italic.',
          multiline: true,
        }),
        introEmphasis: fields.text({
          label: 'Emphasis line',
          description: 'The pulled-out italic line after the intro (green left border).',
          multiline: true,
        }),
        etymology: fields.object({
          label: fields.text({ label: 'Box label', defaultValue: 'Etymology' }),
          word: fields.text({ label: 'Word' }),
          pronunciation: fields.text({ label: 'Pronunciation' }),
          meaning: fields.text({ label: 'Meaning' }),
          translatesTo: fields.text({ label: 'Translates-to line', multiline: true }),
        }, { label: 'Etymology box' }),

        copsesHeading: fields.text({ label: 'Copses section heading', defaultValue: 'The Copses' }),
        copsesTitle: fields.text({ label: 'Copses title', description: '*asterisks* for italic.' }),
        copsesIntro: fields.text({ label: 'Copses intro', multiline: true }),
        copses: fields.array(
          fields.object({
            number: fields.text({ label: 'Number label', description: 'e.g. "Copse · 01".' }),
            name: fields.text({ label: 'Name', description: '*asterisks* for emerald italic.' }),
            status: fields.text({ label: 'Status pill', description: 'e.g. "In Motion", "Building", "Naming".' }),
            inMotion: fields.checkbox({ label: 'Status pill is emerald (the "In Motion" style)', defaultValue: false }),
            current: fields.checkbox({ label: 'Highlight this card yellow (the current copse)', defaultValue: false }),
            tagline: fields.text({ label: 'Tagline', multiline: true }),
            blurb: fields.text({ label: 'Blurb', multiline: true }),
            brands: fields.text({ label: 'Inside the copse (brand list)', description: 'Separate with " · ".', multiline: true }),
          }),
          {
            label: 'Copses',
            description: 'The grid is designed for three. More or fewer still saves, but three looks best.',
            itemLabel: (p) => p.fields.name.value || 'Copse',
          }
        ),

        signupEyebrow: fields.text({ label: 'Signup eyebrow' }),
        signupTitle: fields.text({ label: 'Signup title', description: '*asterisks* for italic.' }),
        signupBody: fields.text({ label: 'Signup body', multiline: true }),
        signupFootnote: fields.text({ label: 'Signup footnote' }),

        branchesHeading: fields.text({ label: 'Branches section heading', defaultValue: 'The Branch Letters' }),
        branchesTitle: fields.text({ label: 'Branches title', description: '*asterisks* for italic.' }),
        branchesIntro: fields.text({ label: 'Branches intro', multiline: true }),
        branches: fields.array(
          fields.object({
            type: fields.text({ label: 'Type label', description: 'e.g. "Mothership", "Branch · 01".' }),
            name: fields.text({ label: 'Name', description: '*asterisks* for emerald italic.' }),
            status: fields.text({ label: 'Status' }),
            mothership: fields.checkbox({ label: 'Highlight yellow (the mothership cell)', defaultValue: false }),
            desc: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Branch letters',
            description: 'The grid is designed for four. More or fewer still saves, but four looks best.',
            itemLabel: (p) => p.fields.name.value || 'Branch',
          }
        ),
      },
    }),
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// https://astro.build/config
//
// Output stays 'static'. Astro 5 removed 'hybrid'. With the Netlify adapter
// present, the Keystatic integration injects its own admin + API routes marked
// for on-demand rendering, so those run as Netlify Functions while every public
// page stays static HTML.
//
// react() is required: the Keystatic admin UI is a React app.
// We do NOT use @astrojs/markdoc here. The Dailies body is rendered with the
// @markdoc/markdoc library directly inside the page (see src/lib/render-markdoc.ts),
// which keeps the dependency list smaller.
export default defineConfig({
  site: 'https://sunshinemoxie.co',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), keystatic()],
});

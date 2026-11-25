import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { splitNotesPlugin } from './scripts/split-notes.mjs';
import { stripSourcesPlugin } from './scripts/strip-sources.mjs';
import { nightChromePlugin } from './scripts/night-chrome.mjs';

export default defineConfig({
  plugins: [react(), splitNotesPlugin(), stripSourcesPlugin(), nightChromePlugin()],
  // The default 5s fails whole suites on a busy machine; they pass in well under this when it isn't.
  test: { testTimeout: 30_000, hookTimeout: 30_000 },
  build: {
    // 98.css uses `@media (not(hover))`, which the default CSS minifier rejects.
    cssMinify: false,
    // The data is most of the download, so say so only about unexpected growth.
    chunkSizeWarningLimit: 2000,
    rolldownOptions: {
      output: {
        // Data, libraries and the app change at different times; apart, a returning visitor re-downloads only what did.
        codeSplitting: {
          groups: [
            { name: 'data-houses', test: /\/src\/data\/houses\.ts$/, priority: 3 },
            { name: 'data-designers', test: /\/src\/data\/designers\.ts$/, priority: 3 },
            { name: 'data-collaborations', test: /\/src\/data\/collaborations\.ts$/, priority: 3 },
            { name: 'data-base', test: /\/src\/data\/(tags|countries|groups|cities)\.ts$/, priority: 3 },
            { name: 'vendor', test: /\/node_modules\//, priority: 2 },
          ],
        },
      },
    },
  },
});

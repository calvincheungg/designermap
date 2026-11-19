import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { stripSourcesPlugin } from './scripts/strip-sources.mjs';
import { nightChromePlugin } from './scripts/night-chrome.mjs';

export default defineConfig({
  plugins: [react(), stripSourcesPlugin(), nightChromePlugin()],
  build: {
    // 98.css uses `@media (not(hover))`, which the default CSS minifier rejects.
    cssMinify: false,
  },
});

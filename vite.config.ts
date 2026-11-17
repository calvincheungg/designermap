import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { stripSourcesPlugin } from './scripts/strip-sources.mjs';

export default defineConfig({
  plugins: [react(), stripSourcesPlugin()],
  build: {
    // 98.css uses `@media (not(hover))`, which the default CSS minifier rejects.
    cssMinify: false,
  },
});

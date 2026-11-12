import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // 98.css uses `@media (not(hover))`, which the default CSS minifier rejects.
    cssMinify: false,
  },
});

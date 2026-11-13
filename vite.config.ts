import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 98.css uses `@media (not(hover))`, which the default CSS minifier rejects.
    cssMinify: false,
  },
});

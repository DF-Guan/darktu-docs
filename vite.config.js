import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  root: fs.realpathSync(process.cwd()),
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
  server: {
    port: 5180,
  },
});

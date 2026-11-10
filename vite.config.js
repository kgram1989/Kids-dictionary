import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the site works at any GitHub Pages path.
export default defineConfig({
  base: './',
  plugins: [react()],
});

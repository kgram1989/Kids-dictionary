import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Every build gets its own id. It is baked into the app and also written
// to version.json, so an open app can tell when a newer build is live.
const buildId = Date.now().toString(36);

const versionFile = () => ({
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: buildId }) });
  },
});

// Relative base so the site works at any GitHub Pages path.
export default defineConfig({
  base: './',
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [react(), versionFile()],
});

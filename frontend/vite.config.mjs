import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
 test: {
  include: ['src/__tests__/**/*.test.jsx'],
  globals: true,
  environment: 'jsdom',
  setupFiles: resolve(__dirname, 'vitest.setup.js'),
},

});

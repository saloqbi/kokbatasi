import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ✅ هذا هو المهم
    environment: 'jsdom',
    setupFiles: './vitest.setup.js'
  }
})

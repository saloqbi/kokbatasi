import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // الجذر هو frontend مباشرة
  plugins: [react()],
})

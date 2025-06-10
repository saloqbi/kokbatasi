import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src', // إن لزم
  publicDir: '../public', // فقط إذا كنت تستخدم root: 'src'
})

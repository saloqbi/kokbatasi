import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'public',         // اجعل الجذر مجلد public
  publicDir: '../public', // تشير إلى نفس المجلد للثوابت الأخرى
  plugins: [react()],
  build: {
    outDir: '../dist',    // أو أي مجلد تريد البناء فيه
  }
})

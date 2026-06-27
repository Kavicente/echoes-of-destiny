import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ONLY proxy API calls to Next.js backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
      // Do NOT proxy /assets — Vite should serve from public/assets folder
    }
  }
})
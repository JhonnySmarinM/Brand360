import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    open: true,
    strictPort: false
  }
})

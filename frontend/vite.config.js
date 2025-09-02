import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    strictPort: true  // This will force Vite to use port 5173 or fail
  },
  preview: {
    port: 5173,
    strictPort: true
  }
})

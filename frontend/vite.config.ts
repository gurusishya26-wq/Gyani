// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← this line MUST be here

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),               // ← official plugin – without it v4 often fails silently
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',   // optional, but good to have
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Enable React and Tailwind CSS in Vite.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})


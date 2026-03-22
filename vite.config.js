import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    minify: 'terser', // Usa Terser para minificar el código
    terserOptions: {
      compress: {
        drop_console: true,  // Elimina todos los console.*
        drop_debugger: true, // Elimina todos los debugger.*
      },
    },
  },
})
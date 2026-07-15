import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Backend: dotnet run → https://localhost:7052 (CORS yok; proxy ile aynı origin)
        target: 'https://localhost:7052',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

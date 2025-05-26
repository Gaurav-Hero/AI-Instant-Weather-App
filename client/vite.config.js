import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weather': {
        target: 'http://localhost:3000', // this matches the Docker Compose service name
        changeOrigin: true,
      },
    },
  },
})

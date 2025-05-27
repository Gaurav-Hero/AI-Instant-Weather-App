import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weather': {
        target: 'https://instant-weather-app-backend.onrender.com', // this matches the Docker Compose service name
        changeOrigin: true,
      },
    },
  },
})

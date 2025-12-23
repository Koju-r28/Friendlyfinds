import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/component'),
      '@assets': path.resolve(__dirname, './src/component/Assets')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
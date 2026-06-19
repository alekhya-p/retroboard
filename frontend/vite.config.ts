import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // Vite handles history mode automatically for Vue Router
  },
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Configure rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['vue', 'vue-router', 'pinia', 'vuetify']
        }
      }
    },
    // Ensure all files in public directory are copied to dist
    copyPublicDir: true,
  },
  // Ensure public directory is properly handled
  publicDir: 'public'
})
import { defineConfig } from 'vite'

// './' keeps asset URLs relative, so the built site works both on
// GitHub Pages (under /<repo-name>/) and on any static host / custom domain.
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
})

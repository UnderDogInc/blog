import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,

  experimental: {
    viteEnvironmentApi: true
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@tiptap')) {
              return 'tiptap'
            }
          }
        }
      }
    }
  },

  layer: {
    meta: {
      name: 'admin-layer'
    }
  }
})

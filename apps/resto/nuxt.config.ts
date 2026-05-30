import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: ['../../layers/shared', '../../layers/resto'],
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  vite: {
    envDir: fileURLToPath(new URL('../..', import.meta.url)),
    cacheDir: fileURLToPath(new URL('./.cache/vite', import.meta.url))
  },

  runtimeConfig: {
    public: {
      app: 'resto',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})

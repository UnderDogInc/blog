import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: ['../../layers/shared', '../../layers/admin'],
  srcDir: fileURLToPath(new URL('../../layers/admin/app', import.meta.url)),
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  ssr: false,

  css: [fileURLToPath(new URL('../../layers/admin/app/styles/main.css', import.meta.url))],

  vite: {
    envDir: fileURLToPath(new URL('../..', import.meta.url)),
    cacheDir: fileURLToPath(new URL('./.cache/vite', import.meta.url)),
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      modulePreload: {
        polyfill: false
      }
    }
  },

  runtimeConfig: {
    public: {
      app: 'writer',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      blogUrl: process.env.NUXT_PUBLIC_BLOG_URL,
      writerUrl: process.env.NUXT_PUBLIC_WRITER_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true
      },
      '/assets': {
        target: process.env.NUXT_API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Rassvet Writer',
      meta: [
        {
          name: 'robots',
          content: 'noindex, nofollow'
        }
      ]
    }
  }
})

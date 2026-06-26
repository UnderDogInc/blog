import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'
import { nestDevProxy } from '../../scripts/nestDevProxy'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: ['../../layers/shared', '../../layers/blog'],
  srcDir: fileURLToPath(new URL('../../layers/blog/app', import.meta.url)),
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  css: [fileURLToPath(new URL('../../layers/blog/app/styles/main.css', import.meta.url))],

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
      app: 'blog',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      blogUrl: process.env.NUXT_PUBLIC_BLOG_URL,
      writerUrl: process.env.NUXT_PUBLIC_WRITER_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },

  nitro: {
    devProxy: nestDevProxy
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Rassvet — блог о разработке и дизайне',
      meta: [
        {
          name: 'description',
          content:
            'Практические материалы о веб-разработке, дизайне и продуктивности — для профессионалов и начинающих.'
        },
        { property: 'og:site_name', content: 'Rassvet' },
        {
          property: 'og:description',
          content:
            'Практические материалы о веб-разработке, дизайне и продуктивности — для профессионалов и начинающих.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ru_RU' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  }
})

import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { defineNuxtConfig } from 'nuxt/config'

const monorepoRoot = fileURLToPath(new URL('../..', import.meta.url))
Object.assign(process.env, loadEnv(process.env.NODE_ENV || 'development', monorepoRoot, ''))

export default defineNuxtConfig({
  layer: {
    meta: {
      name: 'shared-layer'
    }
  },

  alias: {
    '#shared': fileURLToPath(new URL('./app/shared', import.meta.url))
  },

  imports: {
    dirs: [
      fileURLToPath(new URL('./app/shared/api', import.meta.url)),
      fileURLToPath(new URL('./app/shared/lib', import.meta.url))
    ]
  },

  modules: ['@nuxt/fonts', '@nuxt/image', '@vueuse/nuxt'],

  fonts: {
    defaults: {
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic']
    },
    families: [
      {
        name: 'DM Sans',
        provider: 'google',
        weights: ['100 1000'],
        global: true
      },
      {
        name: 'Fraunces',
        provider: 'google',
        weights: ['100 900'],
        subsets: ['latin'],
        global: false
      }
    ]
  },

  image: {
    quality: 75,
    format: ['webp', 'avif'],
    domains: ['localhost'],
    ipx: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '4000',
          pathname: '/**'
        }
      ]
    }
  },

  runtimeConfig: {
    apiProxyTarget: process.env.NUXT_API_PROXY_TARGET || '',
    contactForm: {
      smtpHost: process.env.NUXT_CONTACT_SMTP_HOST || 'smtp.yandex.ru',
      smtpPort: Number(process.env.NUXT_CONTACT_SMTP_PORT || 465),
      smtpSecure:
        process.env.NUXT_CONTACT_SMTP_SECURE === 'true'
          ? true
          : process.env.NUXT_CONTACT_SMTP_SECURE === 'false'
            ? false
            : undefined,
      smtpUser: process.env.NUXT_CONTACT_SMTP_USER || '',
      smtpPass: process.env.NUXT_CONTACT_SMTP_PASS || '',
      to: process.env.NUXT_CONTACT_TO || 'your@mail.com',
      from: process.env.NUXT_CONTACT_FROM || '',
      fromName: process.env.NUXT_CONTACT_FROM_NAME || '',
      siteName: process.env.NUXT_CONTACT_SITE_NAME || 'Сайт'
    },
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      apiOrigin: process.env.NUXT_PUBLIC_API_ORIGIN || 'http://localhost:4000',
      siteUrl: 'http://localhost:3000',
      blogUrl: 'http://localhost:3000',
      writerUrl: 'http://localhost:3001'
    }
  }
})

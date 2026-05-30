import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  layer: {
    meta: {
      name: 'resto-layer'
    }
  },

  runtimeConfig: {
    contactForm: {
      siteName: 'RestoPro'
    }
  }
})

const nestOrigin = (process.env.NUXT_API_PROXY_TARGET || 'http://localhost:4000').replace(/\/$/, '')

/** devProxy для blog/writer: Nitro срезает префикс /api, target должен его сохранять */
export const nestDevProxy = {
  '/api': {
    target: `${nestOrigin}/api`,
    changeOrigin: true
  },
  '/assets': {
    target: `${nestOrigin}/assets`,
    changeOrigin: true
  }
}

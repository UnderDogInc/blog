const path = require('node:path')

const root = __dirname

function nuxtApp(name, port, extraEnv = {}) {
  return {
    name: `rassvet-${name}`,
    script: path.join(root, `apps/${name}/.output/server/index.mjs`),
    cwd: root,
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '600M',
    env_file: path.join(root, '.env'),
    env: {
      NODE_ENV: 'production',
      PORT: String(port),
      NITRO_HOST: '127.0.0.1',
      ...extraEnv
    },
    error_file: path.join(root, 'logs/pm2', `${name}-error.log`),
    out_file: path.join(root, 'logs/pm2', `${name}-out.log`),
    merge_logs: true,
    time: true
  }
}

module.exports = {
  apps: [
    nuxtApp('blog', 3000, {
      NUXT_PUBLIC_SITE_URL:
        process.env.NUXT_PUBLIC_BLOG_SITE_URL || process.env.NUXT_PUBLIC_BLOG_URL
    }),
    nuxtApp('writer', 3001, {
      NUXT_PUBLIC_SITE_URL:
        process.env.NUXT_PUBLIC_WRITER_SITE_URL || process.env.NUXT_PUBLIC_WRITER_URL
    }),
    nuxtApp('resto', 3002, {
      NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_RESTO_SITE_URL
    })
  ]
}

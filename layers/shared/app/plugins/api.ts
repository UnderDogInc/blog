import type { ApiEnvelope } from '#shared/types/api'
import { resolveApiBase } from '#shared/lib/resolveApiBase'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    },
    onRequest({ options }) {
      options.baseURL = resolveApiBase(useRuntimeConfig(), import.meta.server)
    },
    onResponse({ response }) {
      const body = response._data

      if (!body || typeof body !== 'object' || !('data' in body) || !('error' in body)) {
        return
      }

      const envelope = body as ApiEnvelope<unknown>

      if (envelope.error) {
        throw new Error(envelope.error.message || 'API error')
      }

      response._data = envelope.data
    },
    async onResponseError({ response }) {
      if (response.status !== 401) {
        return
      }

      if (config.public.app === 'blog') {
        await navigateTo(`${config.public.writerUrl}/login`, { external: true })
        return
      }

      await navigateTo('/login')
    }
  })

  return {
    provide: {
      api
    }
  }
})

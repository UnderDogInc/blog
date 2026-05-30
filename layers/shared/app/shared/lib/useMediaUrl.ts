export function buildMediaOrigin(apiBase: string, apiOrigin?: string): string {
  if (apiBase.startsWith('/')) {
    return apiOrigin?.replace(/\/$/, '') ?? ''
  }

  return apiBase.replace(/\/api\/?$/, '')
}

function encodePathSegments(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(decodeURIComponent(segment)) : segment))
    .join('/')
}

export function buildMediaUrl(path: string | undefined, apiBase: string, apiOrigin?: string): string {
  if (!path) {
    return ''
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path)
      url.pathname = encodePathSegments(url.pathname)
      return url.toString()
    } catch {
      return path
    }
  }

  const base = buildMediaOrigin(apiBase, apiOrigin)

  if (path.startsWith('/')) {
    return base ? `${base}${encodePathSegments(path)}` : encodePathSegments(path)
  }

  return base ? `${base}/assets/${encodePathSegments(path)}` : `/assets/${encodePathSegments(path)}`
}

export function useResolveMediaUrl() {
  const config = useRuntimeConfig()

  return (path?: string) => buildMediaUrl(path, config.public.apiBase, config.public.apiOrigin)
}

export function useMediaUrl(path?: MaybeRefOrGetter<string | undefined>) {
  const resolve = useResolveMediaUrl()

  return computed(() => resolve(toValue(path)))
}

export function useMediaPreconnect() {
  const config = useRuntimeConfig()

  if (config.public.apiBase.startsWith('/')) {
    return
  }

  const origin = buildMediaOrigin(config.public.apiBase, config.public.apiOrigin)

  useHead({
    link: [
      { rel: 'dns-prefetch', href: origin },
      { rel: 'preconnect', href: origin }
    ]
  })
}

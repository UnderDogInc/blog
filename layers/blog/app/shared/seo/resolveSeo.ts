const ASSET_PATH_RE = /\/assets\/[^?#\s"']+/i

export function extractAssetPath(value?: string | null): string | null {
  if (!value) {
    return null
  }

  if (value.startsWith('/assets/')) {
    return value.split(/[?#]/)[0] ?? null
  }

  if (value.startsWith('assets/')) {
    return `/${value.split(/[?#]/)[0]}`
  }

  const match = value.match(ASSET_PATH_RE)
  return match?.[0] ?? null
}

/** Origin текущего сайта: на SSR — из запроса, на клиенте — из конфига или window */
export function useSiteOrigin() {
  const config = useRuntimeConfig()
  const serverOrigin = import.meta.server
    ? useRequestURL().origin.replace(/\/$/, '')
    : ''

  return computed(() => {
    if (import.meta.server) {
      return serverOrigin
    }

    const configured = (config.public.siteUrl || config.public.blogUrl || '').replace(/\/$/, '')

    if (configured) {
      return configured
    }

    return window.location.origin.replace(/\/$/, '')
  })
}

export function resolveSiteOrigin(siteUrl?: string, fallbackUrl?: string): string {
  return (siteUrl || fallbackUrl || '').replace(/\/$/, '')
}

/** Абсолютный URL для og:image — тот же домен, что и страница (через nginx /assets) */
export function resolveSeoImage(
  image: string | undefined,
  siteOrigin: string,
  fallbackPath = '/og-cover.png'
): string | undefined {
  if (!siteOrigin) {
    return undefined
  }

  const assetPath = extractAssetPath(image)

  if (assetPath) {
    return `${siteOrigin}${assetPath}`
  }

  if (image?.startsWith('http://') || image?.startsWith('https://')) {
    return image
  }

  if (image?.startsWith('/') && !image.startsWith('/assets/')) {
    return `${siteOrigin}${image}`
  }

  return `${siteOrigin}${fallbackPath}`
}

/** @deprecated Используй resolveSeoImage + useSiteOrigin */
export function resolveOgImage(
  image: string | undefined,
  siteOrigin: string,
  fallbackPath = '/og-cover.png'
): string | undefined {
  return resolveSeoImage(image, siteOrigin, fallbackPath)
}

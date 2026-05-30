export function resolveSiteOrigin(siteUrl?: string, fallbackUrl?: string): string {
  return (siteUrl || fallbackUrl || '').replace(/\/$/, '')
}

export function resolveOgImage(
  image: string | undefined,
  siteOrigin: string,
  fallbackPath = '/og-cover.svg'
): string | undefined {
  if (image?.startsWith('http://') || image?.startsWith('https://')) {
    return image
  }

  if (image?.startsWith('/') && siteOrigin) {
    return `${siteOrigin}${image}`
  }

  if (!siteOrigin) {
    return undefined
  }

  return `${siteOrigin}${fallbackPath}`
}

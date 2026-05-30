export function useLcpImagePreload(
  sources: MaybeRefOrGetter<string | undefined | Array<string | undefined>>
) {
  useHead(() => {
    const raw = toValue(sources)
    const hrefs = (Array.isArray(raw) ? raw : [raw]).filter(Boolean) as string[]

    if (!hrefs.length) {
      return {}
    }

    return {
      link: hrefs.map((href, index) => ({
        rel: 'preload',
        as: 'image',
        href,
        fetchpriority: index === 0 ? 'high' : 'low'
      }))
    }
  })
}

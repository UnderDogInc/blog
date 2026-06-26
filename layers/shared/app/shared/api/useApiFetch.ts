function resolveFetchKey(
  url: MaybeRefOrGetter<string>,
  query: MaybeRefOrGetter<unknown> | undefined,
  key: MaybeRefOrGetter<string> | undefined
) {
  if (key !== undefined) {
    return key
  }

  return computed(() => {
    const resolvedUrl = toValue(url)
    const resolvedQuery = toValue(query)

    if (
      resolvedQuery
      && typeof resolvedQuery === 'object'
      && Object.keys(resolvedQuery as Record<string, unknown>).length > 0
    ) {
      return `api:${resolvedUrl}:${JSON.stringify(resolvedQuery)}`
    }

    return `api:${resolvedUrl}`
  })
}

export function useApiFetch<T = unknown>(
  url: MaybeRefOrGetter<string>,
  options: Parameters<typeof useFetch<T>>[1] = {}
) {
  const { $api } = useNuxtApp()
  const { key, query, ...rest } = options

  return useFetch<T>(url, {
    ...rest,
    key: resolveFetchKey(url, query, key),
    query,
    $fetch: $api as typeof $fetch,
    throwOnError: options.throwOnError ?? false
  })
}

import type { AsyncDataOptions } from '#app'
import type { FetchOptions } from 'ofetch'

type UseApiDataOptions<T> = AsyncDataOptions<T> & {
  query?: MaybeRefOrGetter<Record<string, unknown>>
}

export function useApiData<T>(
  key: MaybeRefOrGetter<string>,
  url: MaybeRefOrGetter<string>,
  options?: UseApiDataOptions<T>
) {
  const { $api } = useNuxtApp()
  const { query, ...asyncDataOptions } = options ?? {}

  return useAsyncData<T>(
    key,
    () => {
      const fetchOptions: FetchOptions<'json'> = {}

      if (query) {
        fetchOptions.query = toValue(query)
      }

      return $api<T>(toValue(url), fetchOptions)
    },
    asyncDataOptions
  )
}

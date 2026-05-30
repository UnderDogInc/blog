import type { ApiListData } from '#shared/types/api'
import type { Post, PostCategory } from '~/entities/post'

export const BLOG_POSTS_PER_PAGE = 9

export function useBlogFeed() {
  const route = useRoute()
  const router = useRouter()

  const { data: categoriesData } = useApiFetch<ApiListData<PostCategory>>('categories', {
    query: { limit: 100 }
  })

  const categories = computed(() => categoriesData.value?.items ?? [])

  const activeCategoryKey = computed(() => {
    const value = route.query.category
    return typeof value === 'string' && value.length > 0 ? value : null
  })

  const activeCategory = computed(() => {
    if (!activeCategoryKey.value) {
      return null
    }

    return (
      categories.value.find(
        (item) =>
          item.key === activeCategoryKey.value || String(item.id) === activeCategoryKey.value
      ) ?? null
    )
  })

  const activeCategoryId = computed(() => activeCategory.value?.id ?? null)

  const currentPage = computed({
    get: () => {
      const page = Number(route.query.page)
      return Number.isFinite(page) && page > 0 ? page : 1
    },
    set: (page: number) => {
      const query = { ...route.query }

      if (page > 1) {
        query.page = String(page)
      } else {
        delete query.page
      }

      router.push({ query })
    }
  })

  const postsQuery = computed(() => {
    const params: Record<string, string | number> = {
      page: currentPage.value,
      limit: BLOG_POSTS_PER_PAGE
    }

    if (activeCategoryId.value) {
      params.categoryIds = JSON.stringify([activeCategoryId.value])
    }

    return params
  })

  const { data, pending } = useApiFetch<ApiListData<Post>>('posts', {
    query: postsQuery,
    watch: [postsQuery]
  })

  const hasLoadedOnce = ref(false)
  const lastPosts = shallowRef<ApiListData<Post>>({ items: [], total: 0, totalPages: 0 })

  watch(
    data,
    (value) => {
      if (value) {
        hasLoadedOnce.value = true
        lastPosts.value = value
      }
    },
    { immediate: true }
  )

  const isInitialLoading = computed(() => {
    if (!pending.value) {
      return false
    }

    return !(data.value?.items?.length || lastPosts.value.items.length)
  })

  const isRefreshing = computed(() => {
    if (!pending.value) {
      return false
    }

    return Boolean(data.value?.items?.length || lastPosts.value.items.length)
  })

  const postsData = computed(() => {
    const source = data.value ?? (isRefreshing.value ? lastPosts.value : null)

    return {
      posts: source?.items ?? [],
      total: source?.total ?? 0,
      totalPages: source?.totalPages ?? 0
    }
  })

  watch(
    () => postsData.value.totalPages,
    (totalPages) => {
      if (totalPages > 0 && currentPage.value > totalPages) {
        currentPage.value = 1
      }
    }
  )

  watch(
    () => route.query.page,
    () => {
      if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }
  )

  function categoryLinkQuery(key?: string) {
    const query = { ...route.query }
    delete query.page

    if (key) {
      query.category = key
    } else {
      delete query.category
    }

    return { query }
  }

  return {
    categories,
    activeCategoryKey,
    activeCategory,
    currentPage,
    postsData,
    isInitialLoading,
    isRefreshing,
    categoryLinkQuery
  }
}

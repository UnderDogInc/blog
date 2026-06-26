<script setup lang="ts">
import MainListEmpty from './MainListEmpty.vue'
import MainListSkeleton from './MainListSkeleton.vue'
import type { Post } from '~/entities/post'

interface MainListProps {
  posts: Post[]
  loading?: boolean
  refreshing?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

const props = defineProps<MainListProps>()
const slots = useSlots()

const requestUrl = useRequestURL()
const gridRef = ref<HTMLElement | null>(null)
const lockedMinHeight = ref<number | null>(null)

const showSkeleton = computed(() => props.loading && props.posts.length === 0)
const showEmpty = computed(() => !props.loading && !props.refreshing && props.posts.length === 0)
const showList = computed(() => props.posts.length > 0)

const featuredPost = computed(() => (props.posts.length >= 3 ? props.posts[0] : null))
const gridPosts = computed(() => (featuredPost.value ? props.posts.slice(1) : props.posts))

const gridClass = computed(() => {
  const count = gridPosts.value.length

  if (count === 1) {
    return 'post-feed-grid post-feed-grid--one'
  }

  if (count === 2) {
    return 'post-feed-grid post-feed-grid--two'
  }

  return 'post-feed-grid'
})

watch(
  () => props.refreshing,
  async (refreshing) => {
    if (!import.meta.client) {
      return
    }

    if (refreshing) {
      await nextTick()

      if (gridRef.value) {
        lockedMinHeight.value = gridRef.value.offsetHeight
      }

      return
    }

    requestAnimationFrame(() => {
      lockedMinHeight.value = null
    })
  }
)
</script>

<template>
  <section aria-label="Список статей" class="relative">
    <MainListSkeleton v-if="showSkeleton" />

    <MainListEmpty v-else-if="showEmpty" :title="emptyTitle" :description="emptyDescription" />

    <template v-else-if="showList">
      <div v-if="featuredPost && slots.featured" class="mb-6 sm:mb-8">
        <slot name="featured" :post="featuredPost" :index="0" />
      </div>

      <div class="relative w-full">
        <ul
          ref="gridRef"
          :class="[gridClass, refreshing ? 'opacity-60' : 'opacity-100', 'transition-opacity duration-300']"
          :style="lockedMinHeight ? { minHeight: `${lockedMinHeight}px` } : undefined"
          role="list"
          itemtype="https://schema.org/ItemList"
          itemscope
        >
          <li
            v-for="(post, index) in gridPosts"
            :key="post.id"
            class="h-full min-w-0"
            role="listitem"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
          >
            <meta :content="String(featuredPost ? index + 2 : index + 1)" itemprop="position" />
            <meta :content="`${requestUrl.origin}/post/${post.id}`" itemprop="url" />
            <slot name="list" :post="post" :index="featuredPost ? index + 1 : index" />
          </li>
        </ul>

        <div
          v-if="refreshing"
          class="pointer-events-none absolute inset-0 z-10 flex justify-center pt-32"
          aria-hidden="true"
        >
          <span class="loading loading-spinner loading-md text-primary" />
        </div>
      </div>
    </template>

    <nav v-if="slots.footer && showList" class="mt-12 flex justify-center" aria-label="Пагинация">
      <slot name="footer" />
    </nav>
  </section>
</template>

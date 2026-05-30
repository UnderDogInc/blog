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
      <div class="relative w-full">
        <ul
          ref="gridRef"
          class="post-feed-grid transition-opacity duration-300"
          :class="refreshing ? 'opacity-60' : 'opacity-100'"
          :style="lockedMinHeight ? { minHeight: `${lockedMinHeight}px` } : undefined"
          role="list"
          itemtype="https://schema.org/ItemList"
          itemscope
        >
          <li
            v-for="(post, index) in posts"
            :key="post.id"
            class="h-full"
            role="listitem"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
          >
            <meta :content="String(index + 1)" itemprop="position" />
            <meta :content="`${requestUrl.origin}/post/${post.id}`" itemprop="url" />
            <slot name="list" :post="post" :index="index" />
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

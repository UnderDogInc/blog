<script setup lang="ts">
import MainList from './MainList.vue'
import MainTitle from './MainTitle.vue'
import MainNavigation from './MainNavigation.vue'
import { UiCard, UiPagination } from '#shared/ui'
import { useBlogFeed } from '../model/useBlogFeed'
import { useBlogIndexSeo } from '../model/useBlogIndexSeo'

const toMediaUrl = useResolveMediaUrl()

const {
  categories,
  activeCategoryKey,
  activeCategory,
  currentPage,
  postsData,
  isInitialLoading,
  isRefreshing,
  categoryLinkQuery
} = useBlogFeed()

useBlogIndexSeo({ activeCategory, currentPage, posts: computed(() => postsData.value.posts) })

const emptyState = computed(() => {
  if (!activeCategory.value) {
    return {}
  }

  return {
    title: `В категории «${activeCategory.value.name}» пока нет статей`,
    description: 'Выберите другую категорию или посмотрите все материалы.'
  }
})

const aboveFoldPreviews = computed(() =>
  postsData.value.posts.slice(0, 3).map((post) => toMediaUrl(post.preview))
)

useLcpImagePreload(aboveFoldPreviews)
</script>

<template>
  <div>
    <MainTitle :posts-length="postsData.total" :category-name="activeCategory?.name" />
    <MainNavigation
      :categories="categories"
      :active-category-key="activeCategoryKey"
      :category-link-query="categoryLinkQuery"
    />
    <MainList
      :posts="postsData.posts"
      :loading="isInitialLoading"
      :refreshing="isRefreshing"
      :empty-title="emptyState.title"
      :empty-description="emptyState.description"
    >
      <template #list="{ post, index }">
        <NuxtLink
          :to="`/post/${post.id}`"
          class="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
        >
          <UiCard
            :title="post.title"
            :description="post.description"
            :category="post.category?.name"
            :preview="toMediaUrl(post.preview)"
            :date="post.createdAt"
            :priority="index < 3 && !isRefreshing"
          />
        </NuxtLink>
      </template>

      <template v-if="postsData.totalPages > 1" #footer>
        <UiPagination v-model="currentPage" :total="postsData.totalPages" />
      </template>
    </MainList>
  </div>
</template>

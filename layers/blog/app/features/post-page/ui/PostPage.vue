<script setup lang="ts">
import PostContent from './PostContent.vue'
import PostHeader from './PostHeader.vue'
import type { Post } from '~/entities/post'
import { useBlogPostSeo } from '../model/useBlogPostSeo'

const route = useRoute()
const postId = computed(() => String(route.params.id))

const {
  data: post,
  pending,
  error
} = await useApiFetch<Post>(() => `posts/${postId.value}`, {
  watch: [postId]
})

const toMediaUrl = useResolveMediaUrl()

const lcpPreviewUrl = computed(() => toMediaUrl(post.value?.preview))

useLcpImagePreload(lcpPreviewUrl)
useBlogPostSeo(computed(() => post.value ?? null))
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div v-if="pending" class="flex flex-col items-center justify-center py-24 gap-4">
      <span class="loading loading-spinner loading-lg text-primary" />
      <p class="text-sm text-base-content/50">Загружаем статью…</p>
    </div>

    <div v-else-if="error" class="alert alert-error rounded-2xl">
      <span>Не удалось загрузить пост. Попробуйте обновить страницу.</span>
    </div>

    <article v-else-if="post" itemscope itemtype="https://schema.org/BlogPosting">
      <PostHeader
        :title="post.title"
        :preview="post.preview"
        :description="post.description"
        :date="post.createdAt"
        :category="post.category?.name"
      />
      <PostContent :content="post.content" class="pb-16 lg:pb-24" />
    </article>
  </div>
</template>

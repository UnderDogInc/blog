<script setup lang="ts">
import { PostPage } from '~/features/post-page'
import type { Post } from '~/entities/post'

definePageMeta({ layout: 'blog' })

const route = useRoute()
const postId = computed(() => String(route.params.id))

const {
  data: post,
  pending,
  error
} = await useApiData<Post>(
  () => `blog-post:${postId.value}`,
  () => `posts/${postId.value}`,
  { watch: [postId] }
)
</script>

<template>
  <PostPage :post="post" :pending="pending" :error="error" />
</template>

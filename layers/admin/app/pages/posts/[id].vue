<script setup lang="ts">
import { PostEditorForm } from '~/features/post-editor'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const postId = computed(() => Number(route.params.id))
</script>

<template>
  <PostEditorForm mode="edit" :post-id="postId" />
</template>

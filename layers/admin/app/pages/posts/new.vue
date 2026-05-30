<script setup lang="ts">
import { PostEditorForm } from '~/features/post-editor'

definePageMeta({ layout: 'admin' })
</script>

<template>
  <PostEditorForm mode="create" />
</template>

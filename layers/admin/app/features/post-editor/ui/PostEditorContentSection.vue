<script setup lang="ts">
import PostRichTextEditor from './PostRichTextEditor.vue'

defineProps<{
  error?: string
}>()

const content = defineModel<string>('content', { required: true })

defineEmits<{
  error: [message: string]
}>()
</script>

<template>
  <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl">
    <div class="card-body gap-4 p-5 sm:p-6">
      <h2 class="text-lg font-semibold">Контент *</h2>
      <PostRichTextEditor v-model="content" @error="$emit('error', $event)" />
      <span v-if="error" class="text-error text-xs">{{ error }}</span>
    </div>
  </div>
</template>

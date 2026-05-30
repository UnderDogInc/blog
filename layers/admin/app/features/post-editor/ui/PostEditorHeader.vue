<script setup lang="ts">
defineProps<{
  isEdit: boolean
  title: string
  postId?: number
  loading: boolean
  deleting: boolean
}>()

defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <p class="text-sm font-medium text-primary mb-1">
        {{ isEdit ? 'Редактирование' : 'Новая публикация' }}
      </p>
      <h1 class="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
        {{ isEdit ? title || `Пост #${postId}` : 'Создание поста' }}
      </h1>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink to="/" class="btn btn-ghost btn-sm rounded-full">← К списку</NuxtLink>
      <button
        v-if="isEdit"
        type="button"
        class="btn btn-error btn-outline btn-sm rounded-full"
        :disabled="deleting || loading"
        @click="$emit('remove')"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

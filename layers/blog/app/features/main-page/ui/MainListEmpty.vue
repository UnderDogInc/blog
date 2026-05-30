<script setup lang="ts">
import { StackIcon } from '#shared/ui'

interface EmptyList {
  title?: string
  description?: string
}

withDefaults(defineProps<EmptyList>(), {
  title: 'Пока ничего нет',
  description: 'Здесь появятся статьи, как только они будут опубликованы.'
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border border-dashed border-base-300 bg-base-100/60"
  >
    <div class="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-5 text-base-content/40">
      <StackIcon />
    </div>
    <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
    <p class="text-base-content/70 max-w-sm leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

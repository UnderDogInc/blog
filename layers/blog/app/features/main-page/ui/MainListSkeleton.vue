<script setup lang="ts">
import { BLOG_POSTS_PER_PAGE } from '../model/useBlogFeed'

withDefaults(
  defineProps<{
    length?: number
  }>(),
  {
    length: BLOG_POSTS_PER_PAGE
  }
)
</script>

<template>
  <ul class="post-feed-grid" aria-label="Загрузка статей">
    <li v-for="n in length" :key="n" class="h-full">
      <div
        class="card bg-base-100 h-full border border-base-300/60 shadow-sm overflow-hidden rounded-2xl"
      >
        <div class="skeleton aspect-video w-full shrink-0" />
        <div class="card-body gap-3 p-5 lg:p-6 flex flex-col flex-1">
          <div class="flex items-center gap-2 min-h-[1.25rem]">
            <div class="skeleton h-5 w-20 rounded-full" />
            <div class="skeleton h-4 w-16 rounded-md" />
          </div>
          <div class="skeleton min-h-[3.5rem] w-full rounded-lg" />
          <div class="skeleton min-h-[2.75rem] w-full rounded-lg" />
          <div class="skeleton h-4 w-20 rounded-md mt-auto pt-1" />
        </div>
      </div>
    </li>
  </ul>
</template>

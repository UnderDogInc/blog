<script setup lang="ts">
import type { PostCategory } from '~/entities/post'

defineProps<{
  categories: PostCategory[]
  activeCategoryKey?: string | null
  categoryLinkQuery: (key?: string) => { query: Record<string, unknown> }
}>()
</script>

<template>
  <nav
    class="flex items-center gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1"
    aria-label="Фильтр по категориям"
  >
    <NuxtLink
      :to="categoryLinkQuery()"
      class="btn btn-sm rounded-full font-medium shrink-0"
      :class="!activeCategoryKey ? 'btn-primary' : 'btn-ghost'"
      :aria-current="!activeCategoryKey ? 'page' : undefined"
    >
      Все материалы
    </NuxtLink>

    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="categoryLinkQuery(category.key)"
      class="btn btn-sm rounded-full font-medium shrink-0"
      :class="activeCategoryKey === category.key ? 'btn-primary' : 'btn-ghost'"
      :aria-current="activeCategoryKey === category.key ? 'page' : undefined"
    >
      {{ category.name }}
    </NuxtLink>
  </nav>
</template>

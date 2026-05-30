<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'
import type { ApiListData } from '#shared/types/api'
import type { Category } from '~/entities/category'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const now = useNow()

const { data, pending, error, refresh } = await useApiFetch<ApiListData<Category>>('categories', {
  query: { limit: 100 }
})

const categories = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const updatedAt = computed(() => useDateFormat(now, 'HH:mm:ss').value)

function openCategory(id: number) {
  router.push(`/categories/${id}`)
}

function formatDate(value?: string) {
  if (!value) {
    return '—'
  }

  return useDateFormat(new Date(value), 'DD.MM.YYYY HH:mm').value
}
</script>

<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-primary mb-1">Админ-панель</p>
        <h1 class="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-base-content">
          Категории
        </h1>
        <p class="mt-2 text-sm text-base-content/60">
          {{ total }} {{ total === 1 ? 'категория' : total >= 2 && total <= 4 ? 'категории' : 'категорий' }}
          · обновлено {{ updatedAt }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          class="btn btn-outline btn-sm rounded-full"
          :disabled="pending"
          @click="refresh"
        >
          <span v-if="pending" class="loading loading-spinner loading-xs" />
          Обновить
        </button>
        <NuxtLink
          to="/categories/new"
          class="btn btn-primary btn-sm rounded-full font-semibold shadow-md shadow-primary/25"
        >
          + Создать категорию
        </NuxtLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-error rounded-2xl">
      <span>Не удалось загрузить категории.</span>
    </div>

    <div v-if="pending" class="grid gap-3">
      <div v-for="i in 4" :key="i" class="skeleton h-20 rounded-2xl" />
    </div>

    <div
      v-else-if="categories.length === 0"
      class="card bg-base-100 border border-dashed border-base-300/80 rounded-2xl"
    >
      <div class="card-body items-center text-center py-16 px-6">
        <div class="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center text-3xl mb-4">
          🏷️
        </div>
        <h2 class="text-xl font-semibold">Категорий пока нет</h2>
        <p class="text-sm text-base-content/60 mt-2 max-w-sm">
          Создайте категорию, чтобы группировать статьи на главной странице блога.
        </p>
        <NuxtLink to="/categories/new" class="btn btn-primary rounded-full mt-6">
          Создать первую категорию
        </NuxtLink>
      </div>
    </div>

    <div v-else class="grid gap-3">
      <article
        v-for="category in categories"
        :key="category.id"
        class="group card bg-base-100 border border-base-300/60 shadow-sm hover:shadow-lg hover:border-primary/25 rounded-2xl transition-all duration-300 cursor-pointer"
        @click="openCategory(category.id)"
      >
        <div class="card-body p-4 sm:p-5 flex flex-row items-center justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="badge badge-outline badge-sm font-mono">#{{ category.id }}</span>
              <code class="text-xs bg-base-200 px-2 py-0.5 rounded-lg text-base-content/70">
                {{ category.key }}
              </code>
            </div>
            <h2 class="text-lg font-bold truncate group-hover:text-primary transition-colors">
              {{ category.name }}
            </h2>
            <p class="text-xs text-base-content/50 mt-2">
              Создана: {{ formatDate(category.createdAt) }}
              · обновлена: {{ formatDate(category.updatedAt) }}
            </p>
          </div>

          <svg
            class="size-5 shrink-0 text-base-content/30 group-hover:text-primary transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'
import type { ApiListData } from '#shared/types/api'

definePageMeta({ layout: 'admin' })

type PostItem = {
  id: number
  title: string
  description: string
  preview: string
  createdAt: string
  updatedAt: string
  category?: {
    id: number
    name: string
    key: string
  }
}

const router = useRouter()
const now = useNow()
const toMediaUrl = useResolveMediaUrl()

const { data, pending, error, refresh } = await useApiFetch<ApiListData<PostItem>>('posts')

const posts = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const updatedAt = computed(() => useDateFormat(now, 'HH:mm:ss').value)

function openPost(id: number) {
  router.push(`/posts/${id}`)
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
          Посты
        </h1>
        <p class="mt-2 text-sm text-base-content/60">
          {{ total }} {{ total === 1 ? 'статья' : total >= 2 && total <= 4 ? 'статьи' : 'статей' }}
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
          to="/posts/new"
          class="btn btn-primary btn-sm rounded-full font-semibold shadow-md shadow-primary/25"
        >
          + Создать пост
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl">
        <div class="card-body p-5">
          <p class="text-xs font-medium uppercase tracking-wide text-base-content/50">Всего</p>
          <p class="text-3xl font-bold tabular-nums mt-1">{{ total }}</p>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl">
        <div class="card-body p-5">
          <p class="text-xs font-medium uppercase tracking-wide text-base-content/50">На странице</p>
          <p class="text-3xl font-bold tabular-nums mt-1">{{ posts.length }}</p>
        </div>
      </div>
      <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl col-span-2 lg:col-span-1">
        <div class="card-body p-5">
          <p class="text-xs font-medium uppercase tracking-wide text-base-content/50">Статус</p>
          <p class="text-sm font-medium mt-2 flex items-center gap-2">
            <span
              class="size-2 rounded-full"
              :class="pending ? 'bg-warning animate-pulse' : error ? 'bg-error' : 'bg-success'"
            />
            {{ pending ? 'Загрузка…' : error ? 'Ошибка' : 'Актуально' }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-error rounded-2xl">
      <span>Не удалось загрузить посты. Попробуйте обновить страницу.</span>
    </div>

    <div v-if="pending" class="grid gap-4">
      <div v-for="i in 4" :key="i" class="card bg-base-100 border border-base-300/60 rounded-2xl overflow-hidden">
        <div class="flex gap-4 p-4">
          <div class="skeleton w-28 aspect-video rounded-xl shrink-0" />
          <div class="flex-1 space-y-3 py-1">
            <div class="skeleton h-5 w-3/4 rounded-lg" />
            <div class="skeleton h-4 w-full rounded-lg" />
            <div class="skeleton h-4 w-1/2 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="posts.length === 0"
      class="card bg-base-100 border border-dashed border-base-300/80 rounded-2xl"
    >
      <div class="card-body items-center text-center py-16 px-6">
        <div class="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center text-3xl mb-4">
          📝
        </div>
        <h2 class="text-xl font-semibold">Постов пока нет</h2>
        <p class="text-sm text-base-content/60 mt-2 max-w-sm">
          Создайте первую статью — она появится в блоге после публикации.
        </p>
        <NuxtLink to="/posts/new" class="btn btn-primary rounded-full mt-6">
          Создать первый пост
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group card bg-base-100 border border-base-300/60 shadow-sm hover:shadow-lg hover:border-primary/25 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
        @click="openPost(post.id)"
      >
        <div class="flex flex-col sm:flex-row gap-0 sm:gap-4">
          <div class="sm:w-44 lg:w-52 shrink-0 bg-base-200">
            <img
              v-if="post.preview"
              :src="toMediaUrl(post.preview)"
              :alt="post.title"
              class="w-full aspect-video sm:aspect-square sm:h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div
              v-else
              class="w-full aspect-video sm:aspect-square sm:h-full min-h-[7rem] flex items-center justify-center text-base-content/30 text-sm"
            >
              Нет превью
            </div>
          </div>

          <div class="card-body p-4 sm:p-5 flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="badge badge-outline badge-sm font-mono">#{{ post.id }}</span>
              <span v-if="post.category" class="badge badge-primary badge-soft badge-sm">
                {{ post.category.name }}
              </span>
            </div>

            <h2 class="text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {{ post.title }}
            </h2>

            <p v-if="post.description" class="text-sm text-base-content/65 line-clamp-2 mt-2 leading-relaxed">
              {{ post.description }}
            </p>

            <div class="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs text-base-content/50">
              <span>Создан: {{ formatDate(post.createdAt) }}</span>
              <span>Обновлён: {{ formatDate(post.updatedAt) }}</span>
            </div>
          </div>

          <div class="hidden lg:flex items-center pr-5 text-base-content/30 group-hover:text-primary transition-colors">
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

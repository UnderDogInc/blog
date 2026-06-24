<script setup lang="ts">
import type { PostPayload, PostSelectItem } from '~/entities/post'

defineProps<{
  form: PostPayload
  recommendedPosts: PostSelectItem[]
}>()

defineEmits<{
  recommendedChange: [event: Event]
}>()
</script>

<template>
  <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl">
    <div class="card-body gap-5 p-5 sm:p-6">
      <h2 class="text-lg font-semibold">SEO и рекомендации</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <label class="form-control w-full block">
          <span class="label-text font-medium mb-1.5 block">Meta title</span>
          <input v-model="form.metaTitle" class="input input-bordered w-full rounded-xl" />
          <span class="text-gray-500/75 text-xs">
            *Этот title невидимый. Что в нем должно быть?
            <a
              class="underline"
              href="https://blog.ringostat.com/ru/kak-pravilno-napisat-meta-tegi-title-description-keywords/"
              target="_blank"
              rel="noopener noreferrer"
            >
              клик сюда
            </a>
          </span>
        </label>

        <label class="form-control w-full block">
          <span class="label-text font-medium mb-1.5 block">CTA button</span>
          <input v-model="form.ctaButton" class="input input-bordered w-full rounded-xl" />
        </label>
      </div>

      <label class="form-control w-full">
        <span class="label-text font-medium mb-1.5 block">Рекомендованные посты</span>
        <select
          class="select select-bordered w-full rounded-xl min-h-32"
          multiple
          @change="$emit('recommendedChange', $event)"
        >
          <option
            v-for="post in recommendedPosts"
            :key="post.id"
            :value="post.id"
            :selected="form.recommendedPostIds.includes(post.id)"
          >
            {{ post.id }} — {{ post.title }}
          </option>
        </select>
        <span class="label-text-alt mt-1.5">Зажми Cmd/Ctrl для выбора нескольких</span>
      </label>
    </div>
  </div>
</template>

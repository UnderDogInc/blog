<script setup lang="ts">
import { UiImage } from '#shared/ui'

interface PostHeaderProps {
  title: string
  preview?: string
  description?: string
  date?: string
  category?: string
}

const props = defineProps<PostHeaderProps>()

const previewUrl = useMediaUrl(() => props.preview)
const publishedDate = computed(() => {
  if (!props.date) {
    return ''
  }
  return useDateFormat(new Date(props.date), 'DD.MM.YYYY').value
})
</script>

<template>
  <header class="mb-10 lg:mb-14">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-sm font-medium text-base-content/50 hover:text-primary transition-colors mb-8 group"
    >
      <span class="transition-transform group-hover:-translate-x-0.5" aria-hidden="true">←</span>
      Все статьи
    </NuxtLink>

    <div class="flex flex-wrap items-center gap-2 mb-5">
      <NuxtLink
        v-if="category"
        to="/"
        class="badge badge-primary badge-soft badge-lg font-medium hover:badge-primary transition-colors"
      >
        {{ category }}
      </NuxtLink>
      <time
        v-if="publishedDate"
        class="text-sm text-base-content/55 font-medium"
        :datetime="date"
        itemprop="datePublished"
      >
        {{ publishedDate }}
      </time>
    </div>

    <h1
      class="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-semibold leading-[1.12] tracking-tight text-base-content max-w-4xl"
      itemprop="headline"
    >
      {{ title }}
    </h1>

    <p
      v-if="description"
      class="mt-5 text-lg lg:text-xl text-base-content/70 leading-relaxed max-w-3xl"
      itemprop="description"
    >
      {{ description }}
    </p>

    <div
      v-if="previewUrl"
      class="mt-10 lg:mt-12 overflow-hidden rounded-2xl lg:rounded-3xl border border-base-300/60 shadow-lg shadow-base-300/30"
      itemprop="image"
      itemscope
      itemtype="https://schema.org/ImageObject"
    >
      <UiImage
        :src="previewUrl"
        :alt="title"
        ratio="16/9"
        size="hero"
        priority
      />
      <meta itemprop="url" :content="previewUrl" />
    </div>
  </header>
</template>

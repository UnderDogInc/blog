<script setup lang="ts">
import UiImage from './UiImage.vue'

interface UiCardProps {
  title: string
  category?: string
  preview: string
  description?: string
  date?: string
  priority?: boolean
}

const props = defineProps<UiCardProps>()

const formattedDate = computed(() => {
  if (!props.date) {
    return ''
  }

  return useDateFormat(new Date(props.date), 'DD.MM.YYYY').value
})
</script>

<template>
  <article
    class="card max-w-[333px] bg-base-100 h-full border border-base-300/60 shadow-sm hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 transition-[box-shadow,border-color,transform] duration-300 overflow-hidden group rounded-2xl flex flex-col"
  >
    <div
      class="relative w-full shrink-0 overflow-hidden [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.03]"
    >
      <UiImage :src="preview" :alt="title" ratio="16/9" size="card" :priority="priority" />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>

    <div class="card-body gap-3 p-5 lg:p-6 flex flex-col flex-1">
      <div class="flex flex-wrap items-center gap-2 min-h-[1.25rem]">
        <span v-if="category" class="badge badge-primary badge-soft badge-sm font-medium">
          {{ category }}
        </span>
        <time
          v-if="formattedDate"
          class="text-xs text-base-content/55 font-medium"
          :datetime="date"
        >
          {{ formattedDate }}
        </time>
      </div>

      <h2
        class="card-title text-lg lg:text-xl font-bold leading-snug line-clamp-2 min-h-[3.5rem] text-base-content group-hover:text-primary transition-colors"
      >
        {{ title }}
      </h2>

      <p
        v-if="description"
        class="text-sm text-base-content/70 line-clamp-2 min-h-[2.75rem] leading-relaxed"
      >
        {{ description }}
      </p>
      <p v-else class="text-sm min-h-[2.75rem]" aria-hidden="true" />

      <div class="card-actions justify-start mt-auto pt-1">
        <span class="text-sm font-semibold text-primary inline-flex items-center gap-1">
          Читать
          <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  </article>
</template>

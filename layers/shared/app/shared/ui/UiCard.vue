<script setup lang="ts">
import UiImage from './UiImage.vue'

interface UiCardProps {
  title: string
  category?: string
  preview: string
  description?: string
  date?: string
  priority?: boolean
  featured?: boolean
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
    class="card w-full bg-base-100 h-full border border-base-300/60 shadow-sm hover:shadow-xl hover:border-primary/25 hover:-translate-y-1 transition-[box-shadow,border-color,transform] duration-300 overflow-hidden group rounded-2xl flex flex-col"
    :class="featured ? 'md:flex-row md:max-h-none' : ''"
  >
    <div
      class="relative w-full shrink-0 overflow-hidden [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.03]"
      :class="
        featured
          ? 'md:w-[44%] [&>div]:md:aspect-auto [&>div]:md:h-full [&>div]:md:min-h-[16rem]'
          : ''
      "
    >
      <UiImage
        :src="preview"
        :alt="title"
        :ratio="featured ? '4/3' : '16/9'"
        size="card"
        :priority="priority"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>

    <div class="card-body gap-3 p-5 lg:p-6 flex flex-col flex-1" :class="featured ? 'md:justify-center md:py-8' : ''">
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
        class="card-title font-bold leading-snug text-base-content group-hover:text-primary transition-colors"
        :class="
          featured
            ? 'text-xl sm:text-2xl lg:text-3xl line-clamp-3 min-h-0'
            : 'text-lg lg:text-xl line-clamp-2 min-h-[3.5rem]'
        "
      >
        {{ title }}
      </h2>

      <p
        v-if="description"
        class="text-base-content/70 leading-relaxed"
        :class="featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2 min-h-[2.75rem]'"
      >
        {{ description }}
      </p>
      <p v-else-if="!featured" class="text-sm min-h-[2.75rem]" aria-hidden="true" />

      <div class="card-actions justify-start mt-auto pt-1">
        <span class="text-sm font-semibold text-primary inline-flex items-center gap-1">
          Читать
          <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  </article>
</template>

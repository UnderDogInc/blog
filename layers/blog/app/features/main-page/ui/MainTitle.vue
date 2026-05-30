<script setup lang="ts">
interface MainTitleProps {
  postsLength?: number
  categoryName?: string | null
}

const props = defineProps<MainTitleProps>()

const countLabel = computed(() => {
  const n = props.postsLength ?? 0
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod10 === 1 && mod100 !== 11) {
    return 'статья'
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'статьи'
  }
  return 'статей'
})
</script>

<template>
  <section class="relative mb-10 lg:mb-14 overflow-hidden rounded-3xl border border-base-300/50 bg-base-100/80 p-8 lg:p-12 shadow-sm">
    <div
      class="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-8 bottom-0 size-48 rounded-full bg-secondary/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
        Блог Rassvet
      </p>
      <h1 class="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.1] text-base-content tracking-tight">
        <template v-if="categoryName">{{ categoryName }}</template>
        <template v-else>
          Идеи о разработке,<br class="hidden sm:block" />
          дизайне и росте
        </template>
      </h1>
      <p class="mt-4 text-base lg:text-lg text-base-content/70 leading-relaxed max-w-xl">
        Практические материалы без воды — от основ до продвинутых тем в вебе и продуктовой работе.
      </p>
      <div v-if="postsLength !== undefined" class="mt-6 min-h-[2.5rem] flex items-center gap-3">
        <span class="badge badge-lg badge-neutral badge-outline font-medium tabular-nums">
          {{ postsLength }} {{ countLabel }}
        </span>
      </div>
    </div>
  </section>
</template>

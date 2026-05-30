<script setup lang="ts">
import { computed } from 'vue'

interface PaginationProps {
  total?: number
  maxVisible?: number
}

const props = withDefaults(defineProps<PaginationProps>(), {
  total: 1,
  maxVisible: 5
})

const modelValue = defineModel<number>({ default: 1 })

const totalPages = computed(() => Math.max(1, props.total || 1))

const currentPage = computed({
  get: () => {
    const page = modelValue.value || 1
    return Math.min(Math.max(1, page), totalPages.value)
  },
  set: (value: number) => {
    if (value === modelValue.value) return
    if (value < 1 || value > totalPages.value) return
    modelValue.value = value
  }
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = props.maxVisible || 5

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []
  const sidePages = Math.floor((maxVisible - 3) / 2)

  pages.push(1)

  let start = Math.max(2, current - sidePages)
  let end = Math.min(total - 1, current + sidePages)

  if (start > 2) {
    pages.push('ellipsis')
  } else {
    start = 2
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < total - 1) {
    pages.push('ellipsis')
  } else if (end === total - 1) {
    pages.push(total - 1)
  }

  if (total > 1) {
    pages.push(total)
  }

  return pages
})

const nextPage = () => currentPage.value++
const prevPage = () => currentPage.value--
</script>

<template>
  <div class="join shadow-sm">
    <button
      class="join-item btn btn-sm sm:btn-md rounded-l-full"
      :class="{ 'btn-disabled': currentPage === 1 }"
      :disabled="currentPage === 1"
      aria-label="Предыдущая страница"
      @click="prevPage"
    >
      <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page !== 'ellipsis'"
        class="join-item btn btn-sm sm:btn-md min-w-9 sm:min-w-10"
        :class="{ 'btn-primary': page === currentPage }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button v-else class="join-item btn btn-sm sm:btn-md btn-disabled" disabled type="button">
        …
      </button>
    </template>

    <button
      class="join-item btn btn-sm sm:btn-md rounded-r-full"
      :class="{ 'btn-disabled': currentPage === totalPages }"
      :disabled="currentPage === totalPages"
      aria-label="Следующая страница"
      @click="nextPage"
    >
      <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

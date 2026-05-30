<script setup lang="ts">
const theme = useColorMode({
  attribute: 'data-theme',
  modes: {
    light: 'light',
    dark: 'dark'
  },
  storageKey: 'rassvet-theme',
  initialValue: 'light'
})

const isDark = computed(() => theme.value === 'dark')

function toggleTheme() {
  theme.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="btn btn-ghost btn-circle btn-sm"
    :aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'"
    @click="toggleTheme"
  >
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      class="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

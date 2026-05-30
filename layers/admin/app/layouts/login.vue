<script setup lang="ts">
import AdminThemeToggle from '~/widgets/theme/AdminThemeToggle.vue'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <div class="absolute top-4 right-4 z-10">
      <AdminThemeToggle />
    </div>
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <slot />
    </main>
  </div>
</template>

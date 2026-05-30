<script setup lang="ts">
import AdminNavigation from '~/widgets/admin-navigation/AdminNavigation.vue'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <AdminNavigation />
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <slot />
    </main>
  </div>
</template>

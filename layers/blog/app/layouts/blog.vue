<script setup lang="ts">
import AppHeader from '~/widgets/header/AppHeader.vue'
import AppFooter from '~/widgets/footer/AppFooter.vue'

useMediaPreconnect()
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <AppHeader />
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

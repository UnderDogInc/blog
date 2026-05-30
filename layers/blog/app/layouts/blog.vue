<script setup lang="ts">
import AppHeader from '~/widgets/header/AppHeader.vue'
import AppFooter from '~/widgets/footer/AppFooter.vue'

useMediaPreconnect()

useHead({
  style: [
    {
      key: 'post-feed-grid',
      innerHTML:
        '.post-feed-grid{display:grid;width:100%;grid-template-columns:minmax(0,1fr);gap:1.5rem;align-items:stretch}@media(min-width:640px){.post-feed-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(min-width:1024px){.post-feed-grid{gap:2rem}}@media(min-width:1280px){.post-feed-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}'
    }
  ]
})
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

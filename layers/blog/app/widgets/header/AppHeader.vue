<script setup lang="ts">
import { AppLogo, ChatIcon } from '#shared/ui'
import AppThemeToggle from '../theme/AppThemeToggle.vue'
</script>

<template>
  <header
    class="glass-nav sticky top-0 z-50 border-b border-base-300/60"
    itemscope
    itemtype="https://schema.org/WPHeader"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-[4.25rem]">
        <NuxtLink to="/" class="flex items-center gap-3 group" aria-label="Rassvet — на главную">
          <div
            class="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105"
          >
            <AppLogo class="fill-current size-6" />
          </div>
          <div class="leading-tight hidden sm:block">
            <span class="text-lg font-bold text-base-content tracking-tight">Rassvet</span>
            <p class="text-[11px] text-base-content/50 font-medium">блог о разработке и дизайне</p>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-1 sm:gap-2">
          <AppThemeToggle />
          <NuxtLink
            to="/consultation"
            class="btn btn-primary btn-sm sm:btn-md gap-2 rounded-full font-semibold shadow-md shadow-primary/25"
            aria-label="Заказать консультацию"
          >
            <ChatIcon class="size-4 shrink-0" />
            <span class="hidden sm:inline">Консультация</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

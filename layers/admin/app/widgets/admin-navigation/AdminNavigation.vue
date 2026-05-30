<script setup lang="ts">
import { AppLogo } from '#shared/ui'
import { useSession } from '~/entities/session'
import AdminThemeToggle from '~/widgets/theme/AdminThemeToggle.vue'

const route = useRoute()
const config = useRuntimeConfig()
const { user, logout } = useSession()

const navLinks = [
  { to: '/', label: 'Посты', exact: true },
  { to: '/categories', label: 'Категории', exact: false },
  { to: '/posts/new', label: 'Новый пост', exact: false }
]

function isActive(link: (typeof navLinks)[number]) {
  if (link.exact) {
    return route.path === link.to
  }

  if (link.to === '/categories') {
    return route.path.startsWith('/categories')
  }

  return route.path.startsWith(link.to)
}
</script>

<template>
  <header class="glass-nav sticky top-0 z-50 border-b border-base-300/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-[4.25rem] gap-4">
        <div class="flex items-center gap-6 lg:gap-8 min-w-0">
          <NuxtLink to="/" class="flex items-center gap-3 group shrink-0">
            <div
              class="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105"
            >
              <AppLogo class="fill-current size-6" />
            </div>
            <div class="leading-tight hidden sm:block">
              <span class="text-lg font-bold text-base-content tracking-tight">Rassvet</span>
              <p class="text-[11px] text-base-content/50 font-medium">writer</p>
            </div>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-1" aria-label="Админ-навигация">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="btn btn-sm rounded-full font-medium"
              :class="isActive(link) ? 'btn-primary' : 'btn-ghost'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center gap-1 sm:gap-2 shrink-0">
          <span v-if="user?.phone" class="hidden lg:inline text-xs text-base-content/50 tabular-nums mr-1">
            {{ user.phone }}
          </span>
          <AdminThemeToggle />
          <NuxtLink
            :to="config.public.blogUrl"
            class="btn btn-ghost btn-sm hidden sm:inline-flex"
            external
            target="_blank"
          >
            На сайт
          </NuxtLink>
          <button type="button" class="btn btn-outline btn-sm rounded-full" @click="logout">
            Выйти
          </button>
        </div>
      </div>

      <nav class="md:hidden flex items-center gap-1 pb-3 -mt-1 overflow-x-auto" aria-label="Админ-навигация">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="btn btn-sm rounded-full font-medium shrink-0"
          :class="isActive(link) ? 'btn-primary' : 'btn-ghost'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

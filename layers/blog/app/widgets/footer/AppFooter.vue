<script setup lang="ts">
import { AppLogo, TelegramIcon, VkIcon, InstagramIcon } from '#shared/ui'

const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="mt-auto border-t border-base-300/60 bg-base-100/50"
    itemscope
    itemtype="https://schema.org/WPFooter"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
        <section class="md:col-span-7" aria-label="О сайте">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center p-2"
            >
              <AppLogo class="fill-current" />
            </div>
            <span class="text-xl font-bold tracking-tight">Rassvet</span>
          </div>
          <p class="text-base-content/70 max-w-md leading-relaxed mb-6">
            Блог о веб-разработке, дизайне и продуктивности — для профессионалов и тех, кто только
            начинает путь.
          </p>
          <nav aria-label="Соцсети">
            <ul class="flex gap-2">
              <li>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-ghost btn-sm btn-square rounded-xl"
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-ghost btn-sm btn-square rounded-xl"
                  aria-label="VK"
                >
                  <VkIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-ghost btn-sm btn-square rounded-xl"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </li>
            </ul>
          </nav>
        </section>

        <nav class="md:col-span-5 md:justify-self-end" aria-label="Навигация в подвале">
          <h4 class="font-semibold text-sm uppercase tracking-wider text-base-content/50 mb-4">
            Разделы
          </h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="link link-hover text-base-content/70 hover:text-primary">
                Все статьи
              </NuxtLink>
            </li>
            <li>
              <a href="#" class="link link-hover text-base-content/70 hover:text-primary">
                О проекте
              </a>
            </li>
            <li>
              <a href="#" class="link link-hover text-base-content/70 hover:text-primary">
                Контакты
              </a>
            </li>
            <li>
              <a href="#" class="link link-hover text-base-content/70 hover:text-primary">
                Политика конфиденциальности
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="divider divider-base-300/50 my-8 before:h-px after:h-px before:bg-base-300/50 after:bg-base-300/50"
      />

      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-base-content/50"
      >
        <ClientOnly>
          <p>© {{ year }} Rassvet. Все права защищены.</p>
        </ClientOnly>

        <p>rassvet.click</p>
      </div>
    </div>
  </footer>
</template>

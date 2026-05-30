<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { parseContentImages } from '../model/parseContentImages'

interface Props {
  content?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()
const config = useRuntimeConfig()

const html = computed(() =>
  parseContentImages(props.content || '', config.public.apiBase, config.public.apiOrigin)
)
</script>

<template>
  <div class="post-page" v-bind="attrs">
    <article
      v-html="html"
      class="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-base-content prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-base-content/75 prose-p:leading-[1.75] prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-base-content prose-strong:font-semibold prose-li:marker:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-base-200/60 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-base-content/80 prose-code:text-primary prose-code:bg-base-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral prose-pre:text-neutral-content prose-pre:rounded-xl prose-pre:shadow-inner prose-img:rounded-xl prose-img:shadow-md"
    />
  </div>
</template>

<style scoped>
:deep(.content-image) {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin: 2rem auto;
}

:deep(.content-image-img) {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  box-shadow: 0 4px 24px -4px oklch(0% 0 0 / 0.12);
}

:deep(table) {
  border-collapse: collapse;
  margin: 1.5rem 0;
  width: 100%;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  overflow: hidden;
}

:deep(th),
:deep(td) {
  border: 1px solid color-mix(in oklch, var(--color-base-content) 15%, transparent);
  padding: 0.625rem 1rem;
}

:deep(th) {
  background: var(--color-base-200);
  font-weight: 600;
}

:deep(mark) {
  background: color-mix(in oklch, var(--color-warning) 35%, transparent);
  border-radius: 0.2rem;
  padding: 0 0.15rem;
}

:deep(hr) {
  border-color: color-mix(in oklch, var(--color-base-content) 15%, transparent);
  margin: 2.5rem 0;
}
</style>

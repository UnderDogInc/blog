<script setup lang="ts">
defineOptions({ inheritAttrs: false })

interface Props {
  src: string
  alt: string
  ratio?: '4/3' | '16/9'
  size?: 'card' | 'hero' | 'full'
  priority?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  ratio: '16/9',
  size: 'full',
  priority: false
})

const failed = ref(false)
const useNative = ref(false)

const ratioClass = computed(() => {
  return props.ratio === '16/9' ? 'aspect-video' : 'aspect-[4/3]'
})

const useOptimizer = computed(() => props.size !== 'full' && !useNative.value && !failed.value)

const imgWidth = computed(() => (props.size === 'card' ? 640 : props.size === 'hero' ? 1280 : undefined))
const imgHeight = computed(() => (props.size === 'card' ? 360 : props.size === 'hero' ? 720 : undefined))

watch(
  () => props.src,
  () => {
    failed.value = false
    useNative.value = false
  }
)

function onError() {
  if (useOptimizer.value) {
    useNative.value = true
    return
  }

  failed.value = true
}
</script>

<template>
  <div
    class="relative w-full overflow-hidden bg-base-200"
    :class="ratioClass"
  >
    <div
      v-if="failed || !src"
      class="absolute inset-0 flex items-center justify-center bg-base-200 text-base-content/25"
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>

    <NuxtImg
      v-if="src && useOptimizer"
      provider="ipx"
      :src="src"
      :alt="alt"
      :width="imgWidth"
      :height="imgHeight"
      fit="cover"
      format="webp"
      quality="75"
      densities="1"
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
      class="absolute inset-0 size-full object-cover"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      @error="onError"
    />

    <img
      v-else-if="src && !failed"
      :src="src"
      :alt="alt"
      class="absolute inset-0 size-full object-cover"
      :width="imgWidth"
      :height="imgHeight"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      @error="onError"
    >
  </div>
</template>

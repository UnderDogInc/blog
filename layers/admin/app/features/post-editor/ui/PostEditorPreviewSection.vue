<script setup lang="ts">
import type { PostPayload } from '~/entities/post'

const previewInputRef = ref<HTMLInputElement | null>(null)

defineProps<{
  form: PostPayload
  previewDisplayUrl: string
  previewUploading: boolean
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  previewPicked: [event: Event]
  clearPreview: []
}>()

function openPicker() {
  previewInputRef.value?.click()
}
</script>

<template>
  <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl">
    <div class="card-body gap-5 p-5 sm:p-6">
      <h2 class="text-lg font-semibold">Превью</h2>

      <div
        class="border-2 border-dashed border-base-300 rounded-2xl p-4 sm:p-6 bg-base-200/40 flex flex-col items-center gap-4 transition-colors"
        :class="{ 'opacity-60 pointer-events-none': previewUploading }"
      >
        <div
          v-if="form.preview"
          class="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-base-200 shadow-md"
        >
          <img :src="previewDisplayUrl" alt="Превью поста" class="w-full h-full object-cover" />
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center w-full max-w-md aspect-video rounded-xl bg-base-200/80 text-base-content/45 text-sm gap-2"
        >
          <svg class="size-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Перетащите изображение
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2">
          <button type="button" class="btn btn-primary btn-sm rounded-full" @click="openPicker">
            <span v-if="previewUploading" class="loading loading-spinner loading-xs" />
            {{ form.preview ? 'Заменить' : 'Загрузить' }}
          </button>
          <button
            v-if="form.preview"
            type="button"
            class="btn btn-ghost btn-sm rounded-full"
            @click="emit('clearPreview')"
          >
            Удалить
          </button>
        </div>

        <input
          ref="previewInputRef"
          type="file"
          class="hidden"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          @change="emit('previewPicked', $event)"
        />
      </div>

      <span v-if="errors.preview" class="text-error text-xs">{{ errors.preview }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isEdit: boolean
  loading: boolean
  deleting: boolean
}>()
</script>

<template>
  <div
    class="fixed bottom-0 inset-x-0 z-40 border-t border-base-300/60 bg-base-100/90 backdrop-blur-md px-4 py-3 sm:py-4"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <p class="text-sm text-base-content/55 hidden sm:block">
        {{
          isEdit ? 'Изменения сохраняются на сервере' : 'Новый пост будет создан после сохранения'
        }}
      </p>
      <button
        type="submit"
        class="btn btn-primary rounded-full font-semibold shadow-md shadow-primary/25 sm:ml-auto"
        :disabled="loading || deleting"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        {{ isEdit ? 'Сохранить изменения' : 'Создать пост' }}
      </button>
    </div>
  </div>
</template>

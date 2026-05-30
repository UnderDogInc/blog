<script setup lang="ts">
import { useCategoryForm } from '../model/useCategoryForm'

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit'
    categoryId?: number
  }>(),
  {
    categoryId: undefined
  }
)

const {
  form,
  loading,
  deleting,
  submitError,
  submitSuccess,
  validationErrors,
  onKeyInput,
  submit,
  remove
} = useCategoryForm({
  mode: props.mode,
  categoryId: props.categoryId
})

const isEdit = computed(() => props.mode === 'edit')
</script>

<template>
  <section class="space-y-6 pb-24">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-medium text-primary mb-1">
          {{ isEdit ? 'Редактирование' : 'Новая категория' }}
        </p>
        <h1 class="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
          {{ isEdit ? form.name || `Категория #${categoryId}` : 'Создание категории' }}
        </h1>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink to="/categories" class="btn btn-ghost btn-sm rounded-full">
          ← К списку
        </NuxtLink>
        <button
          v-if="isEdit"
          type="button"
          class="btn btn-error btn-outline btn-sm rounded-full"
          :disabled="deleting || loading"
          @click="remove"
        >
          Удалить
        </button>
      </div>
    </div>

    <div v-if="submitError" class="alert alert-error rounded-2xl">
      <span>{{ submitError }}</span>
    </div>
    <div v-if="submitSuccess" class="alert alert-success rounded-2xl">
      <span>{{ submitSuccess }}</span>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl max-w-2xl">
        <div class="card-body gap-5 p-5 sm:p-6">
          <label class="form-control w-full">
            <span class="label-text font-medium mb-2 block">Название *</span>
            <input
              v-model="form.name"
              class="input input-bordered w-full rounded-xl"
              placeholder="Например, Разработка"
              maxlength="100"
            />
            <span v-if="validationErrors.name" class="text-error text-xs mt-1.5">
              {{ validationErrors.name }}
            </span>
          </label>

          <label class="form-control w-full">
            <span class="label-text font-medium mb-2 block">Ключ (slug) *</span>
            <input
              v-model="form.key"
              class="input input-bordered w-full rounded-xl font-mono"
              placeholder="naprimer-razrabotka"
              maxlength="50"
              @input="onKeyInput"
            />
            <span class="label-text-alt mt-1.5">
              Используется в URL фильтра на сайте: <code>?category={{ form.key || 'key' }}</code>
            </span>
            <span v-if="validationErrors.key" class="text-error text-xs mt-1.5">
              {{ validationErrors.key }}
            </span>
          </label>
        </div>
      </div>

      <div
        class="fixed bottom-0 inset-x-0 z-40 border-t border-base-300/60 bg-base-100/90 backdrop-blur-md px-4 py-3 sm:py-4"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-end gap-4">
          <button
            type="submit"
            class="btn btn-primary rounded-full font-semibold shadow-md shadow-primary/25"
            :disabled="loading || deleting"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            {{ isEdit ? 'Сохранить' : 'Создать категорию' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '~/entities/category'
import type { PostPayload } from '~/entities/post'

defineProps<{
  form: PostPayload
  categories: Category[]
  errors: Record<string, string>
}>()
</script>

<template>
  <div class="card bg-base-100 border border-base-300/60 shadow-sm rounded-2xl">
    <div class="card-body gap-5 p-5 sm:p-6">
      <h2 class="text-lg font-semibold">Основное</h2>

      <label class="form-control w-full">
        <span class="label-text font-medium mb-1.5 block">Заголовок *</span>
        <input v-model="form.title" class="input input-bordered w-full rounded-xl" />
        <span v-if="errors.title" class="text-error text-xs mt-1.5">{{ errors.title }}</span>
      </label>

      <label class="form-control w-full">
        <span class="label-text font-medium mb-1.5 block">Описание *</span>
        <textarea
          v-model="form.description"
          class="textarea textarea-bordered w-full rounded-xl"
          rows="3"
        />
        <span v-if="errors.description" class="text-error text-xs mt-1.5">{{ errors.description }}</span>
      </label>

      <label class="form-control w-full max-w-md">
        <span class="label-text font-medium mb-1.5 block">Категория *</span>
        <select v-model.number="form.categoryId" class="select select-bordered w-full rounded-xl">
          <option :value="0">Выберите категорию</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <span v-if="errors.categoryId" class="text-error text-xs mt-1.5">{{ errors.categoryId }}</span>
      </label>
    </div>
  </div>
</template>

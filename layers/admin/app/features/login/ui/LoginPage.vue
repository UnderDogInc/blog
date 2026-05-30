<script setup lang="ts">
import { AppLogo } from '#shared/ui'
import { useLogin } from '../model/useLogin'

const { formData, errors, loading, onSubmit } = useLogin()
</script>

<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div
        class="w-14 h-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/25 mx-auto mb-4"
      >
        <AppLogo class="fill-current size-8" />
      </div>
      <h1 class="font-display text-3xl font-semibold text-base-content tracking-tight">
        Вход в админку
      </h1>
      <p class="mt-2 text-sm text-base-content/60">Управление статьями и контентом блога</p>
    </div>

    <form
      class="card bg-base-100/80 backdrop-blur-sm border border-base-300/60 shadow-xl shadow-base-300/20 rounded-2xl"
      @submit.prevent="onSubmit"
    >
      <div class="card-body gap-5 p-6 sm:p-8">
        <label class="form-control w-full">
          <span class="label-text font-medium mb-1.5 block">Номер телефона</span>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            class="input input-bordered w-full rounded-xl"
            :class="{ 'input-error': errors.phone }"
            autocomplete="tel"
          />
          <span v-if="errors.phone" class="text-error text-xs mt-1.5">{{ errors.phone }}</span>
        </label>

        <label class="form-control w-full">
          <span class="label-text font-medium mb-1.5 block">Пароль</span>
          <input
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            class="input input-bordered w-full rounded-xl"
            :class="{ 'input-error': errors.password }"
            autocomplete="current-password"
          />
          <span v-if="errors.password" class="text-error text-xs mt-1.5">{{
            errors.password
          }}</span>
        </label>

        <button
          type="submit"
          class="btn btn-primary w-full rounded-xl font-semibold shadow-md shadow-primary/25 mt-1"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          Войти
        </button>
      </div>
    </form>
  </div>
</template>

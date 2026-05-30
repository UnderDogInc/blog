<script setup lang="ts">
import { LoginPage } from '~/features/login'

definePageMeta({ layout: 'login', middleware: 'guest' })
</script>

<template>
  <LoginPage />
</template>

<script setup lang="ts">
import { CategoryForm } from '~/features/categories'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const categoryId = computed(() => Number(route.params.id))
</script>

<template>
  <CategoryForm mode="edit" :category-id="categoryId" />
</template>

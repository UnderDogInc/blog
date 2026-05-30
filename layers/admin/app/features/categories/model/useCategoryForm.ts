import type { Category, CategoryPayload } from '~/entities/category'
import { slugifyCategoryKey, validateCategoryForm } from './validation'

export function useCategoryForm(options: {
  mode: 'create' | 'edit'
  categoryId?: number
}) {
  const api = useApi()
  const router = useRouter()

  const loading = ref(false)
  const deleting = ref(false)
  const submitError = ref('')
  const submitSuccess = ref('')
  const validationErrors = ref<Record<string, string>>({})
  const keyTouched = ref(false)

  const form = reactive<CategoryPayload>({
    name: '',
    key: ''
  })

  async function loadCategory() {
    if (options.mode !== 'edit' || !options.categoryId) {
      return
    }

    loading.value = true
    submitError.value = ''

    try {
      const category = await api<Category>(`/categories/${options.categoryId}`)
      form.name = category.name
      form.key = category.key
      keyTouched.value = true
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Не удалось загрузить категорию')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadCategory)

  watch(
    () => form.name,
    (name) => {
      if (keyTouched.value) {
        return
      }

      form.key = slugifyCategoryKey(name)
    }
  )

  function onKeyInput() {
    keyTouched.value = true
    form.key = slugifyCategoryKey(form.key)
  }

  async function submit() {
    submitError.value = ''
    submitSuccess.value = ''
    validationErrors.value = validateCategoryForm(form)

    if (Object.keys(validationErrors.value).length > 0) {
      return
    }

    loading.value = true

    try {
      const payload = {
        name: form.name.trim(),
        key: form.key.trim()
      }

      if (options.mode === 'edit' && options.categoryId) {
        await api(`/categories/${options.categoryId}`, { method: 'PATCH', body: payload })
        submitSuccess.value = 'Категория обновлена'
      } else {
        const created = await api<Category>('/categories', { method: 'POST', body: payload })
        submitSuccess.value = 'Категория создана'
        await router.push(`/categories/${created.id}`)
      }
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Ошибка сохранения категории')
    } finally {
      loading.value = false
    }
  }

  async function remove() {
    if (!options.categoryId) {
      return
    }

    const confirmed = window.confirm('Удалить категорию? Если к ней привязаны посты, удаление будет отклонено.')
    if (!confirmed) {
      return
    }

    deleting.value = true
    submitError.value = ''
    submitSuccess.value = ''

    try {
      await api(`/categories/${options.categoryId}`, { method: 'DELETE' })
      await router.push('/categories')
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Ошибка удаления категории')
    } finally {
      deleting.value = false
    }
  }

  return {
    form,
    loading,
    deleting,
    submitError,
    submitSuccess,
    validationErrors,
    onKeyInput,
    submit,
    remove
  }
}

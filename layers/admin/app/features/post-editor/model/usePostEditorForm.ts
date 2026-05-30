import type { ApiListData } from '#shared/types/api'
import type { Category } from '~/entities/category'
import type { PostDetails, PostEditorOptions, PostPayload, PostSelectItem } from '~/entities/post'

import { uploadPostAsset } from './uploadPostAsset'
import { validatePostForm } from './validation'

export function usePostEditorForm(options: PostEditorOptions) {
  const api = useApi()
  const toMediaUrl = useResolveMediaUrl()
  const router = useRouter()

  const isEdit = computed(() => options.mode === 'edit' && !!options.postId)
  const loading = ref(false)
  const deleting = ref(false)
  const submitError = ref('')
  const submitSuccess = ref('')
  const validationErrors = ref<Record<string, string>>({})
  const previewUploading = ref(false)

  const form = reactive<PostPayload>({
    title: '',
    preview: '',
    description: '',
    metaTitle: '',
    content: '',
    ctaButton: '',
    categoryId: 0,
    recommendedPostIds: []
  })

  const previewDisplayUrl = computed(() => toMediaUrl(form.preview))

  const { data: categoriesResponse } = useApiData<ApiListData<Category>>(
    () => `admin-categories-${options.mode}-${options.postId ?? 'new'}`,
    '/categories',
    {
      default: () => ({ items: [], total: 0, totalPages: 0 }),
      server: false
    }
  )

  const categories = computed(() => categoriesResponse.value?.items ?? [])

  const { data: recommendedOptions } = useApiData<PostSelectItem[]>(
    () => `admin-post-select-${options.mode}-${options.postId ?? 'new'}`,
    '/posts/select',
    { default: () => [], server: false }
  )

  const availableRecommendedPosts = computed(() =>
    recommendedOptions.value.filter((item) => item.id !== options.postId)
  )

  async function loadPostForEdit() {
    if (!isEdit.value || !options.postId) {
      return
    }

    loading.value = true
    submitError.value = ''

    try {
      const post = await api<PostDetails>(`/posts/${options.postId}`)

      form.title = post.title
      form.preview = post.preview
      form.description = post.description
      form.metaTitle = post.metaTitle ?? ''
      form.content = post.content
      form.ctaButton = post.ctaButton ?? ''
      form.categoryId = post.categoryId
      form.recommendedPostIds = post.recommendedPosts?.map((item) => item.id) ?? []
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Не удалось загрузить пост')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadPostForEdit)

  function setRecommendedPosts(event: Event) {
    const target = event.target as HTMLSelectElement
    form.recommendedPostIds = Array.from(target.selectedOptions).map((option) => Number(option.value))
  }

  function setSubmitError(message: string) {
    submitError.value = message
  }

  async function submit() {
    submitError.value = ''
    submitSuccess.value = ''
    validationErrors.value = validatePostForm(form)

    if (Object.keys(validationErrors.value).length > 0) {
      return
    }

    loading.value = true

    try {
      if (isEdit.value && options.postId) {
        await api(`/posts/${options.postId}`, { method: 'PATCH', body: form })
        submitSuccess.value = 'Пост успешно обновлен'
      } else {
        const created = await api<{ id: number }>('/posts', { method: 'POST', body: form })
        submitSuccess.value = 'Пост успешно создан'
        await router.push(`/posts/${created.id}`)
      }
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Ошибка сохранения поста')
    } finally {
      loading.value = false
    }
  }

  async function remove() {
    if (!options.postId) {
      return
    }

    const confirmed = window.confirm('Точно удалить пост? Это действие нельзя отменить.')
    if (!confirmed) {
      return
    }

    submitError.value = ''
    submitSuccess.value = ''
    deleting.value = true

    try {
      await api(`/posts/${options.postId}`, { method: 'DELETE' })
      await router.push('/')
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Ошибка удаления поста')
    } finally {
      deleting.value = false
    }
  }

  function clearPreview() {
    form.preview = ''
    validationErrors.value.preview = ''
  }

  async function onPreviewPicked(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
      return
    }

    previewUploading.value = true
    submitError.value = ''

    try {
      form.preview = await uploadPostAsset(api, file)
      validationErrors.value.preview = ''
    } catch (error) {
      submitError.value = getApiErrorMessage(error, 'Не удалось загрузить превью')
    } finally {
      previewUploading.value = false
      target.value = ''
    }
  }

  return {
    form,
    isEdit,
    loading,
    deleting,
    submitError,
    submitSuccess,
    validationErrors,
    previewUploading,
    previewDisplayUrl,
    categories,
    availableRecommendedPosts,
    setRecommendedPosts,
    setSubmitError,
    submit,
    remove,
    clearPreview,
    onPreviewPicked
  }
}

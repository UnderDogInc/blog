import type { PostPayload } from '~/entities/post'

export function validatePostForm(form: PostPayload) {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) {
    errors.title = 'Введите заголовок'
  }

  if (!form.preview.trim()) {
    errors.preview = 'Загрузите превью'
  }

  if (!form.description.trim()) {
    errors.description = 'Введите описание'
  }

  if (!form.content.trim()) {
    errors.content = 'Заполните контент'
  }

  if (!form.categoryId || Number.isNaN(form.categoryId)) {
    errors.categoryId = 'Выберите категорию'
  }

  return errors
}

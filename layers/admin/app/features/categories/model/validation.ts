const KEY_PATTERN = /^[a-z0-9-]+$/

export function slugifyCategoryKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function validateCategoryForm(form: { name: string; key: string }) {
  const errors: Record<string, string> = {}
  const name = form.name.trim()
  const key = form.key.trim()

  if (name.length < 2) {
    errors.name = 'Название: минимум 2 символа'
  } else if (name.length > 100) {
    errors.name = 'Название: максимум 100 символов'
  }

  if (key.length < 2) {
    errors.key = 'Ключ: минимум 2 символа'
  } else if (key.length > 50) {
    errors.key = 'Ключ: максимум 50 символов'
  } else if (!KEY_PATTERN.test(key)) {
    errors.key = 'Ключ: только латиница, цифры и дефис'
  }

  return errors
}

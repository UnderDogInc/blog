import type {
  ContactFormPayload,
  ContactFormValidationError,
  ContactFormValidationResult
} from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d\s+()-]{7,20}$/

function trim(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateContactPayload(
  body: unknown
): ContactFormValidationResult | ContactFormValidationError {
  const payload = (body ?? {}) as ContactFormPayload
  const errors: Record<string, string> = {}

  const name = trim(payload.name)
  const phone = trim(payload.phone)
  const email = trim(payload.email)
  const message = trim(payload.message)

  if (name.length < 2) {
    errors.name = 'Укажите имя (минимум 2 символа)'
  }

  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'Укажите корректный телефон'
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Укажите корректный email'
  }

  if (message.length > 2000) {
    errors.message = 'Сообщение слишком длинное'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      email,
      ...(message ? { message } : {})
    }
  }
}

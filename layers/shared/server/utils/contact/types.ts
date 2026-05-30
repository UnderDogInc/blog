export interface ContactFormPayload {
  name: string
  phone: string
  email: string
  message?: string
  _gotcha?: string
}

export interface ContactFormValidationResult {
  ok: true
  data: Required<Pick<ContactFormPayload, 'name' | 'phone' | 'email'>> &
    Pick<ContactFormPayload, 'message'>
}

export interface ContactFormValidationError {
  ok: false
  errors: Record<string, string>
}

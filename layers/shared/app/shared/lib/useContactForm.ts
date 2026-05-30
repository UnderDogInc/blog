export interface ContactFormFields {
  name: string
  phone: string
  email: string
  message?: string
}

export function useContactForm(options?: { endpoint?: string }) {
  const config = useRuntimeConfig()

  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const message = ref('')
  const honeypot = ref('')
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const isError = ref(false)

  const endpoint = options?.endpoint ?? `${config.public.apiBase}/contact`

  async function submit() {
    isLoading.value = true
    isSuccess.value = false
    isError.value = false

    try {
      await $fetch(endpoint, {
        method: 'POST',
        body: {
          name: name.value,
          phone: phone.value,
          email: email.value,
          ...(message.value ? { message: message.value } : {}),
          _gotcha: honeypot.value
        } satisfies ContactFormFields & { _gotcha: string }
      })

      isSuccess.value = true
      resetFields()
    } catch {
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  function resetFields() {
    name.value = ''
    phone.value = ''
    email.value = ''
    message.value = ''
    honeypot.value = ''
  }

  return {
    name,
    phone,
    email,
    message,
    honeypot,
    isLoading,
    isSuccess,
    isError,
    submit,
    resetFields
  }
}

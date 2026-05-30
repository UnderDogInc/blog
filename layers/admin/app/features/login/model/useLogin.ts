import { reactive } from 'vue'
import { useValidationLogin } from './useValidationLogin'
import { useAuth } from '../api/useAuth'

export function useLogin() {
  const router = useRouter()
  const loading = ref(false)

  const formData = reactive({
    phone: '',
    password: ''
  })

  const { errors, validate } = useValidationLogin()
  const { login } = useAuth()

  async function onSubmit() {
    validate(formData)

    try {
      loading.value = true

      await login(formData)

      await router.push('/')
    } catch (e: unknown) {
      errors.password = e instanceof Error ? e.message : 'Ошибка авторизации'
    } finally {
      loading.value = false
    }
  }

  return {
    formData,
    errors,
    loading,
    onSubmit
  }
}

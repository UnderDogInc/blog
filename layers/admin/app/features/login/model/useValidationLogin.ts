import { reactive } from 'vue'
import { PASSWORD_ERROR_MSG, PASSWORD_LENGTH } from '../constants'

export function useValidationLogin() {
  const errors = reactive({
    phone: '',
    password: ''
  })

  function clearErrors() {
    errors.phone = ''
    errors.password = ''
  }

  function validatePhone() {
    return true
  }

  function validatePassword(password: string) {
    if (password.length < PASSWORD_LENGTH) {
      errors.password = PASSWORD_ERROR_MSG
      return false
    }

    errors.password = ''
    return true
  }

  function validate(form: { phone: string; password: string }) {
    clearErrors()

    const isPhoneValid = validatePhone()
    const isPasswordValid = validatePassword(form.password)

    return isPhoneValid && isPasswordValid
  }

  return {
    errors,
    validate,
    clearErrors
  }
}

 import { ref } from 'vue'

export function useUtils() {
  const showSuccessAlert = ref(false)
  const showErrorAlert = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  function showAlert(message, type = 'success') {
    if (type === 'success') {
      successMessage.value = message
      showSuccessAlert.value = true
      setTimeout(() => (showSuccessAlert.value = false), 5000)
    } else {
      errorMessage.value = message
      showErrorAlert.value = true
      setTimeout(() => (showErrorAlert.value = false), 5000)
    }
  }

  return {
    showSuccessAlert,
    showErrorAlert,
    successMessage,
    errorMessage,
    showAlert
  }
}

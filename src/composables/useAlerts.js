 
import { ref } from 'vue'

const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

function showAlert(message, type = 'success') {
  if (type === 'success') {
    successMessage.value = message
    showSuccessAlert.value = true
    setTimeout(() => showSuccessAlert.value = false, 5000)
  } else {
    errorMessage.value = message
    showErrorAlert.value = true
    setTimeout(() => showErrorAlert.value = false, 5000)
  }
}

export function useAlerts() {
  return {
    showAlert,
    showSuccessAlert,
    showErrorAlert,
    successMessage,
    errorMessage
  }
}

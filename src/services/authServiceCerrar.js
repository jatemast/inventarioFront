 
import { API_BASE_URL } from './apiService'

export async function cerrarSesion() {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  } catch (error) {
    console.warn('Error al cerrar sesión:', error)
  }

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

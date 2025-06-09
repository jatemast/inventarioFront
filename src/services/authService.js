import axios from 'axios'

const api = axios.create({
  baseURL:'https://backend2222-c2degshqf0a0fnby.canadacentral-01.azurewebsites.net/index.php/api/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Establecer token automáticamente si ya existe
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Registro
 export async function register(name, email, password, password_confirmation) {
  try {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    })

    const token = response.data.access_token
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en el registro')
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor')
    } else {
      throw new Error('Error al configurar la petición')
    }
  }
}

// Login
export async function login(email, password) {
  try {
    const response = await api.post('/login', { email, password })
    const token = response.data.access_token

    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en el login')
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor')
    } else {
      throw new Error('Error al configurar la petición')
    }
  }
}

// Obtener usuario autenticado
export async function getUser() {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No hay token de autenticación')

    const response = await api.get('/user')
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
    }
    throw error
  }
}

// Logout
export async function logout() {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await api.post('/logout')
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    throw error
  }
}

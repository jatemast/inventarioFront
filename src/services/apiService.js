 
export const API_BASE_URL = 'https://backend2222-c2degshqf0a0fnby.canadacentral-01.azurewebsites.net/index.php/api'

export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    })

    const contentType = response.headers.get('content-type')
    const contentLength = response.headers.get('content-length')

    if (contentLength === '0' || response.status === 204 || !contentType || !contentType.includes('application/json')) {
      return { data: {} }  
    }

    const text = await response.text()
    if (!text.trim()) return { data: {} }

    try {
      const json = JSON.parse(text)
      return { data: json }  
    } catch (err) {
      console.warn('Respuesta no parseable:', text)
      return { data: { message: text } }
    }

  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

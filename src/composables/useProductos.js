import { ref, computed } from 'vue'
import { apiRequest, API_BASE_URL } from '@/services/apiService'
import { useAlerts } from './useAlerts'

export function useProductos() {
  const { showAlert } = useAlerts()

  const products = ref([])
  const selectedProduct = ref(null)
  const editingProduct = ref(null)
  const newProduct = ref({ nombre: '', descripcion: '', stock: 0, precio: 0 })

  const isLoading = ref(true)
  const isSubmitting = ref(false)
  const isUpdating = ref(false)
  const isRefreshing = ref(false)
  const isDeleting = ref(null)
  const isViewingProduct = ref(null)
  const showEditForm = ref(false)
  const showAddProductForm = ref(false)

  const formErrors = ref({})
  const editFormErrors = ref({})
  const searchTerm = ref('')

 async function fetchProducts() {
  try {
    isRefreshing.value = true
    const response = await apiRequest(`${API_BASE_URL}/productos`)
    
     
    products.value = response.data?.data || response.data || response || []

    if (products.value.length > 0) {
      showAlert(`Se cargaron ${products.value.length} productos`, 'success')
    }
  } catch (error) {
    showAlert(`No se pudo conectar con la API: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}


  async function viewProduct(id) {
    try {
      isViewingProduct.value = id
      const response = await apiRequest(`${API_BASE_URL}/productos/${id}`)
      selectedProduct.value = response.data || response
    } catch (error) {
      showAlert(`Error al ver producto: ${error.message}`, 'error')
    } finally {
      isViewingProduct.value = null
    }
  }

  async function createProduct() {
    if (!validateForm()) return
    isSubmitting.value = true
    try {
      const response = await apiRequest(`${API_BASE_URL}/productos`, {
        method: 'POST',
        body: JSON.stringify(newProduct.value)
      })
      products.value.push(response.data || response)
      showAlert('Producto creado correctamente')
      resetForm()
      showAddProductForm.value = false
    } catch (error) {
      showAlert(error.message, 'error')
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateProduct() {
    if (!validateEditForm()) return
    isUpdating.value = true
    try {
      const response = await apiRequest(`${API_BASE_URL}/productos/${editingProduct.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(editingProduct.value)
      })
      const index = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (index !== -1) products.value[index] = response.data || response
      showAlert('Producto actualizado')
      cancelEdit()
    } catch (error) {
      showAlert(error.message, 'error')
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return
    isDeleting.value = id
    try {
      await apiRequest(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' })
      products.value = products.value.filter(p => p.id !== id)
      showAlert('Producto eliminado')
    } catch (error) {
      showAlert(error.message, 'error')
    } finally {
      isDeleting.value = null
    }
  }

  function resetForm() {
    newProduct.value = { nombre: '', descripcion: '', stock: 0, precio: 0 }
    formErrors.value = {}
  }

  function validateForm() {
    formErrors.value = {}
    if (!newProduct.value.nombre.trim()) formErrors.value.nombre = 'Requerido'
    if (!newProduct.value.descripcion.trim()) formErrors.value.descripcion = 'Requerido'
    if (newProduct.value.stock < 0) formErrors.value.stock = 'No puede ser negativo'
    if (newProduct.value.precio <= 0) formErrors.value.precio = 'Mayor a 0'
    return Object.keys(formErrors.value).length === 0
  }

  function validateEditForm() {
    editFormErrors.value = {}
    if (!editingProduct.value.nombre.trim()) editFormErrors.value.nombre = 'Requerido'
    if (!editingProduct.value.descripcion.trim()) editFormErrors.value.descripcion = 'Requerido'
    if (editingProduct.value.stock < 0) editFormErrors.value.stock = 'No puede ser negativo'
    if (editingProduct.value.precio <= 0) editFormErrors.value.precio = 'Mayor a 0'
    return Object.keys(editFormErrors.value).length === 0
  }

  function editProduct(product) {
    editingProduct.value = { ...product }
    showEditForm.value = true
    selectedProduct.value = null
    editFormErrors.value = {}
  }

  function cancelEdit() {
    showEditForm.value = false
    editingProduct.value = null
    editFormErrors.value = {}
  }

  const filteredProducts = computed(() => {
    if (!searchTerm.value.trim()) return products.value
    const term = searchTerm.value.toLowerCase()
    return products.value.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      p.id.toString().includes(term)
    )
  })

  return {
    products,
    selectedProduct,
    editingProduct,
    newProduct,
    formErrors,
    editFormErrors,
    searchTerm,
    filteredProducts,
    isLoading,
    isSubmitting,
    isUpdating,
    isRefreshing,
    isDeleting,
    isViewingProduct,
    showEditForm,
    showAddProductForm,
    fetchProducts,
    viewProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    editProduct,
    cancelEdit,
    resetForm
  }
}

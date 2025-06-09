// src/composables/useDashboardPage.js
import { computed, onMounted } from 'vue'
import { useProductos } from './useProductos'
import { useUtils } from './useUtils'

export function useDashboardPage() {
  const user = JSON.parse(localStorage.getItem('user'))

  const {
    products, selectedProduct, editingProduct, newProduct,
    formErrors, editFormErrors, searchTerm, filteredProducts,
    isLoading, isSubmitting, isUpdating, isRefreshing, isDeleting, isViewingProduct,
    showEditForm, showAddProductForm,
    fetchProducts, viewProduct, createProduct, updateProduct,
    deleteProduct, editProduct, cancelEdit, resetForm,
    connectionError
  } = useProductos()

  const {
    showAlert, showSuccessAlert, showErrorAlert, successMessage, errorMessage
  } = useUtils()

  function toggleAddProductForm() {
    showAddProductForm.value = !showAddProductForm.value
    resetForm()
  }

  function closeProductDetails() {
    selectedProduct.value = null
    cancelEdit()
  }

  async function submitNewProduct() {
    await createProduct()
  }

  async function submitEditProduct() {
    await updateProduct()
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  function getStockTextColorClass(stock) {
    if (stock === 0) return 'text-danger fw-bold'
    if (stock <= 3) return 'text-warning fw-bold'
    return 'text-success fw-bold'
  }

  function getProductStatus(stock) {
    if (stock === 0) return 'Agotado'
    if (stock <= 3) return 'Bajo Stock'
    return 'Disponible'
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Agotado': return 'bg-danger text-white'
      case 'Bajo Stock': return 'bg-warning text-dark'
      case 'Disponible': return 'bg-success text-white'
      default: return 'bg-secondary'
    }
  }

  const statsCards = computed(() => [
    {
      label: 'Productos',
      value: products.value.length.toString(),
      subText: 'En inventario',
      textClass: 'text-primary',
      iconClass: 'bi bi-box',
      iconColorClass: 'text-primary',
      iconBgClass: 'bg-primary bg-opacity-10'
    },
    {
      label: 'Disponibles',
      value: products.value.filter(p => p.stock > 3).length.toString(),
      subText: 'Con buen stock',
      textClass: 'text-success',
      iconClass: 'bi bi-check-circle',
      iconColorClass: 'text-success',
      iconBgClass: 'bg-success bg-opacity-10'
    },
    {
      label: 'Bajo stock',
      value: products.value.filter(p => p.stock > 0 && p.stock <= 3).length.toString(),
      subText: 'Pocas unidades',
      textClass: 'text-warning',
      iconClass: 'bi bi-exclamation-triangle',
      iconColorClass: 'text-warning',
      iconBgClass: 'bg-warning bg-opacity-10'
    },
    {
      label: 'Agotados',
      value: products.value.filter(p => p.stock === 0).length.toString(),
      subText: 'Sin unidades',
      textClass: 'text-danger',
      iconClass: 'bi bi-x-circle',
      iconColorClass: 'text-danger',
      iconBgClass: 'bg-danger bg-opacity-10'
    }
  ])

  onMounted(fetchProducts)

  return {
    user,
    products, selectedProduct, editingProduct, newProduct,
    formErrors, editFormErrors, searchTerm, filteredProducts,
    isLoading, isSubmitting, isUpdating, isRefreshing, isDeleting, isViewingProduct,
    showEditForm, showAddProductForm,
    fetchProducts, viewProduct, createProduct, updateProduct,
    deleteProduct, editProduct, cancelEdit, resetForm,
    connectionError,
    showAlert, showSuccessAlert, showErrorAlert, successMessage, errorMessage,
    toggleAddProductForm, closeProductDetails, submitNewProduct, submitEditProduct,
    formatDate, getStockTextColorClass, getProductStatus, getStatusBadgeClass,
    statsCards
  }
}

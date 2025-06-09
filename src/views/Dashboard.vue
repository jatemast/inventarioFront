<template>
  <div class="min-vh-100 bg-light">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div class="container-fluid px-4">
        <div class="d-flex align-items-center">
          <div class="bg-white p-2 rounded me-3">
            <i class="bi bi-boxes text-primary fs-4"></i>
          </div>
          <div>
            <h4 class="navbar-brand mb-0 fw-bold">Sistema de Inventario - Prueba Técnica</h4>
            <small class="text-white opacity-75">Panel de Control</small>
          </div>
        </div>
        
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center bg-light bg-opacity-25 px-3 py-2 rounded-pill me-3">
            <div class="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 35px; height: 35px;">
              <span class="text-primary fw-bold">{{ user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <span class="text-white fw-medium">{{ user?.name || 'Usuario' }}</span>
          </div>
          <button @click="cerrarSesion" class="btn btn-danger d-flex align-items-center">
            <i class="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <div class="container-fluid px-4 py-4">
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando productos...</p>
      </div>

      <!-- Error de conexión -->
      <div v-if="connectionError" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <strong>Error de conexión:</strong> {{ connectionError }}
        <button @click="fetchProducts" class="btn btn-sm btn-outline-danger ms-2">
          <i class="bi bi-arrow-clockwise me-1"></i>Reintentar
        </button>
      </div>

      <!-- Alertas -->
      <div v-if="showSuccessAlert" class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-check-circle me-2"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" @click="showSuccessAlert = false"></button>
      </div>

      <div v-if="showErrorAlert" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="showErrorAlert = false"></button>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4" v-if="!isLoading">
        <div class="col-xl-3 col-lg-6" v-for="stat in statsCards" :key="stat.label">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <h6 class="text-muted mb-2">{{ stat.label }}</h6>
                  <h2 :class="['fw-bold mb-1', stat.textClass]">{{ stat.value }}</h2>
                  <small :class="stat.textClass">{{ stat.subText }}</small>
                </div>
                <div :class="['p-3 rounded', stat.iconBgClass]">
                  <i :class="[stat.iconClass, stat.iconColorClass, 'fs-1']"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-4 mb-4" v-if="!isLoading">
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0">
              <h5 class="card-title mb-0 fw-bold">Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-3">
                <button 
                  class="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
                  @click="toggleAddProductForm"
                >
                  <i :class="showAddProductForm ? 'bi bi-x-circle' : 'bi bi-plus-circle'" class="me-2"></i> 
                  {{ showAddProductForm ? 'Cancelar' : 'Agregar Producto' }}
                </button>
                <button 
                  class="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                  @click="fetchProducts"
                  :disabled="isRefreshing"
                >
                  <i :class="isRefreshing ? 'spinner-border spinner-border-sm' : 'bi bi-arrow-clockwise'" class="me-2"></i>
                  {{ isRefreshing ? 'Actualizando...' : 'Actualizar Lista' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Product Form -->
      <div v-if="showAddProductForm" class="card mb-4 shadow-sm">
        <div class="card-header bg-white border-0">
          <h5 class="mb-0 fw-bold">
            <i class="bi bi-plus-circle text-primary me-2"></i>
            Nuevo Producto
          </h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitNewProduct">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="productName" class="form-label">
                  <i class="bi bi-box me-1"></i>Nombre del Producto *
                </label>
                <input 
                  v-model="newProduct.nombre" 
                  id="productName" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': formErrors.nombre }"
                  placeholder="Ej: Laptop Dell Inspiron"
                  required 
                />
                <div v-if="formErrors.nombre" class="invalid-feedback">
                  {{ formErrors.nombre }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="productDescription" class="form-label">
                  <i class="bi bi-file-text me-1"></i>Descripción *
                </label>
                <input 
                  v-model="newProduct.descripcion" 
                  id="productDescription" 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.descripcion }"
                  placeholder="Ej: Laptop para uso empresarial"
                  required 
                />
                <div v-if="formErrors.descripcion" class="invalid-feedback">
                  {{ formErrors.descripcion }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="productStock" class="form-label">
                  <i class="bi bi-bar-chart me-1"></i>Cantidad en Stock *
                </label>
                <input 
                  v-model.number="newProduct.stock" 
                  id="productStock" 
                  type="number" 
                  min="0" 
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.stock }"
                  placeholder="0"
                  required 
                />
                <div v-if="formErrors.stock" class="invalid-feedback">
                  {{ formErrors.stock }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="productPrice" class="form-label">
                  <i class="bi bi-currency-dollar me-1"></i>Precio Unitario *
                </label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input 
                    v-model.number="newProduct.precio" 
                    id="productPrice" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.precio }"
                    placeholder="0.00"
                    required 
                  />
                  <div v-if="formErrors.precio" class="invalid-feedback">
                    {{ formErrors.precio }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row mt-4">
              <div class="col-12">
                <div class="d-flex gap-2 justify-content-end">
                  <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                    <i class="bi bi-arrow-clockwise me-1"></i>Limpiar
                  </button>
                  <button type="button" class="btn btn-secondary" @click="toggleAddProductForm">
                    <i class="bi bi-x me-1"></i>Cancelar
                  </button>
                  <button type="submit" class="btn btn-success" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check me-1"></i>
                    {{ isSubmitting ? 'Guardando...' : 'Guardar Producto' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Product Form -->
      <div v-if="showEditForm" class="card mb-4 shadow-sm">
        <div class="card-header bg-white border-0">
          <h5 class="mb-0 fw-bold">
            <i class="bi bi-pencil-square text-warning me-2"></i>
            Editar Producto #{{ editingProduct.id }}
          </h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitEditProduct">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="editProductName" class="form-label">
                  <i class="bi bi-box me-1"></i>Nombre del Producto *
                </label>
                <input 
                  v-model="editingProduct.nombre" 
                  id="editProductName" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': editFormErrors.nombre }"
                  placeholder="Ej: Laptop Dell Inspiron"
                  required 
                />
                <div v-if="editFormErrors.nombre" class="invalid-feedback">
                  {{ editFormErrors.nombre }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="editProductDescription" class="form-label">
                  <i class="bi bi-file-text me-1"></i>Descripción *
                </label>
                <input 
                  v-model="editingProduct.descripcion" 
                  id="editProductDescription" 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': editFormErrors.descripcion }"
                  placeholder="Ej: Laptop para uso empresarial"
                  required 
                />
                <div v-if="editFormErrors.descripcion" class="invalid-feedback">
                  {{ editFormErrors.descripcion }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="editProductStock" class="form-label">
                  <i class="bi bi-bar-chart me-1"></i>Cantidad en Stock *
                </label>
                <input 
                  v-model.number="editingProduct.stock" 
                  id="editProductStock" 
                  type="number" 
                  min="0" 
                  class="form-control"
                  :class="{ 'is-invalid': editFormErrors.stock }"
                  placeholder="0"
                  required 
                />
                <div v-if="editFormErrors.stock" class="invalid-feedback">
                  {{ editFormErrors.stock }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="editProductPrice" class="form-label">
                  <i class="bi bi-currency-dollar me-1"></i>Precio Unitario *
                </label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input 
                    v-model.number="editingProduct.precio" 
                    id="editProductPrice" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    class="form-control"
                    :class="{ 'is-invalid': editFormErrors.precio }"
                    placeholder="0.00"
                    required 
                  />
                  <div v-if="editFormErrors.precio" class="invalid-feedback">
                    {{ editFormErrors.precio }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row mt-4">
              <div class="col-12">
                <div class="d-flex gap-2 justify-content-end">
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">
                    <i class="bi bi-x me-1"></i>Cancelar
                  </button>
                  <button type="submit" class="btn btn-warning" :disabled="isUpdating">
                    <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check me-1"></i>
                    {{ isUpdating ? 'Actualizando...' : 'Actualizar Producto' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Product Details Modal -->
      <div v-if="selectedProduct" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-eye text-info me-2"></i>
                Detalles del Producto #{{ selectedProduct.id }}
              </h5>
              <button type="button" class="btn-close" @click="closeProductDetails"></button>
            </div>
            <div class="modal-body">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-box me-1"></i>Nombre del Producto
                      </h6>
                      <h4 class="fw-bold">{{ selectedProduct.nombre }}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-hash me-1"></i>ID del Producto
                      </h6>
                      <span class="badge bg-secondary fs-6">#{{ selectedProduct.id }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-file-text me-1"></i>Descripción
                      </h6>
                      <p class="mb-0">{{ selectedProduct.descripcion }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card border-0 bg-light">
                    <div class="card-body text-center">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-bar-chart me-1"></i>Stock Disponible
                      </h6>
                      <h3 :class="getStockTextColorClass(selectedProduct.stock)">
                        {{ selectedProduct.stock }} unidades
                      </h3>
                      <span :class="getStatusBadgeClass(getProductStatus(selectedProduct.stock))" class="badge">
                        {{ getProductStatus(selectedProduct.stock) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card border-0 bg-light">
                    <div class="card-body text-center">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-currency-dollar me-1"></i>Precio Unitario
                      </h6>
                      <h3 class="text-primary fw-bold">
                        ${{ parseFloat(selectedProduct.precio).toLocaleString() }}
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card border-0 bg-light">
                    <div class="card-body text-center">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-cash-stack me-1"></i>Valor Total
                      </h6>
                      <h3 class="text-success fw-bold">
                        ${{ (parseFloat(selectedProduct.precio) * selectedProduct.stock).toLocaleString() }}
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-calendar-plus me-1"></i>Fecha de Creación
                      </h6>
                      <p class="mb-0">{{ formatDate(selectedProduct.created_at) }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">
                        <i class="bi bi-calendar-check me-1"></i>Última Actualización
                      </h6>
                      <p class="mb-0">{{ formatDate(selectedProduct.updated_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeProductDetails">
                <i class="bi bi-x me-1"></i>Cerrar
              </button>
              <button type="button" class="btn btn-warning" @click="editProduct(selectedProduct)">
                <i class="bi bi-pencil me-1"></i>Editar Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="products.length === 0 && !isLoading && !connectionError" class="text-center py-5">
        <div class="mb-4">
          <i class="bi bi-box text-muted" style="font-size: 4rem;"></i>
        </div>
        <h4 class="text-muted mb-3">No hay productos en el inventario</h4>
        <p class="text-muted mb-4">Comienza agregando tu primer producto al sistema</p>
        <button 
          class="btn btn-primary btn-lg"
          @click="showAddProductForm = true"
        >
          <i class="bi bi-plus-circle me-2"></i>Agregar Primer Producto
        </button>
      </div>

      <!-- Products Table -->
      <div v-else-if="products.length > 0" class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0">
          <div class="d-flex justify-content-between align-items-center flex-wrap">
            <h5 class="card-title mb-0 fw-bold">
              <i class="bi bi-boxes me-2"></i>
              Productos ({{ filteredProducts.length }})
            </h5>
            <div class="d-flex gap-3 mt-2 mt-md-0">
              <div class="position-relative">
                <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input 
                  type="text" 
                  class="form-control ps-5" 
                  placeholder="Buscar productos..."
                  v-model="searchTerm"
                  style="min-width: 250px;"
                >
              </div>
              <button 
                v-if="searchTerm" 
                class="btn btn-outline-secondary" 
                @click="searchTerm = ''"
                title="Limpiar búsqueda"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Valor Total</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in filteredProducts" :key="product.id">
                  <td>
                    <span class="badge bg-secondary">#{{ product.id }}</span>
                  </td>
                  <td>
                    <div>
                      <strong>{{ product.nombre }}</strong>
                    </div>
                  </td>
                  <td>
                    <small class="text-muted">{{ product.descripcion }}</small>
                  </td>
                  <td>
                    <span :class="getStockTextColorClass(product.stock)">
                      {{ product.stock }} unidades
                    </span>
                  </td>
                  <td class="fw-medium">${{ parseFloat(product.precio).toLocaleString() }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(getProductStatus(product.stock))" class="badge">
                      {{ getProductStatus(product.stock) }}
                    </span>
                  </td>
                  <td class="fw-bold text-success">
                    ${{ (parseFloat(product.precio) * product.stock).toLocaleString() }}
                  </td>
                  <td>
                    <small class="text-muted">{{ formatDate(product.created_at) }}</small>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <button 
                        class="btn btn-sm btn-outline-info"
                        @click="viewProduct(product.id)"
                        :disabled="isViewingProduct === product.id"
                        title="Ver detalles"
                      >
                        <i v-if="isViewingProduct === product.id" class="spinner-border spinner-border-sm"></i>
                        <i v-else class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-warning"
                        @click="editProduct(product)"
                        title="Editar producto"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteProduct(product.id)"
                        :disabled="isDeleting === product.id"
                        title="Eliminar producto"
                      >
                        <i v-if="isDeleting === product.id" class="spinner-border spinner-border-sm"></i>
                        <i v-else class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredProducts.length === 0 && products.length > 0">
                  <td colspan="9" class="text-center text-muted py-4">
                    <i class="bi bi-search me-2"></i>
                    No se encontraron productos que coincidan con "{{ searchTerm }}"
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script setup>
 
import { useDashboardPage } from '../composables/useDashboardPage'
import { cerrarSesion } from '../services/authServiceCerrar'   

 
const {
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
} = useDashboardPage()
</script>




<style scoped>
.alert {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.2s ease;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.modal {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
</style>
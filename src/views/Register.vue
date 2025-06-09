<template>
  <div class="login-bg d-flex justify-content-center align-items-center min-vh-100">
    <div class="login-card card shadow-lg border-0">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <img
            src="https://img.icons8.com/ios-filled/100/4a90e2/add-user-male.png"
            alt="Register Icon"
            class="mb-3"
            style="width: 70px;"
          />
          <h2 class="card-title fw-bold">Crear Cuenta</h2>
          <p class="text-muted">Completa los campos para registrarte</p>
        </div>

        <form @submit.prevent="submit" autocomplete="off">
          <div class="mb-4">
            <label for="name" class="form-label fw-semibold">Nombre</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control form-control-lg"
              placeholder="Tu nombre completo"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="form-label fw-semibold">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control form-control-lg"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label fw-semibold">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control form-control-lg"
              placeholder="********"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password_confirmation" class="form-label fw-semibold">Confirmar Contraseña</label>
            <input
              id="password_confirmation"
              v-model="password_confirmation"
              type="password"
              class="form-control form-control-lg"
              placeholder="********"
              required
            />
          </div>
          <button type="submit" class="btn btn-success btn-lg w-100 shadow-sm">
            Registrarse
          </button>
        </form>

        <div class="text-center mt-3">
          <router-link to="/login" class="text-decoration-none text-primary">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>

        <div v-if="error" class="alert alert-danger mt-4" role="alert">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
 <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authService'  

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const error = ref('')

async function submit() {
  error.value = ''

  try {
    await register(name.value, email.value, password.value, password_confirmation.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.message || 'Hubo un error al registrar el usuario.'
  }
}
</script>


<style scoped>
.login-bg {
  background: linear-gradient(135deg, #4a90e2 0%, #145574 100%);
  min-height: 100vh;
}
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 1.5rem;
  background: #fff;
  animation: fadeIn 0.7s;
}
@media (max-width: 576px) {
  .login-card {
    padding: 0;
    max-width: 95vw;
  }
  .card-body {
    padding: 2rem 1rem !important;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

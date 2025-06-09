 <template>
  <div class="login-bg d-flex justify-content-center align-items-center min-vh-100">
    <div class="login-card card shadow-lg border-0">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <img src="https://img.icons8.com/ios-filled/100/4a90e2/user-male-circle.png" alt="Login Icon" class="mb-3" style="width: 70px;">
          <h2 class="card-title fw-bold">Iniciar Sesión</h2>
          <p class="text-muted">  Bienvenido. Ingresa tus credenciales.
Sistema de Inventario — Prueba Técnica</p>
        </div>
        <form @submit.prevent="submit" autocomplete="off">
          <div class="mb-4">
            <label for="email" class="form-label fw-semibold">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control form-control-lg"
              placeholder="ejemplo@correo.com"
              required
              autofocus
            />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label fw-semibold">Contraseña</label>
            <input
              id="password"
              type="password"
              v-model="password"
              class="form-control form-control-lg"
              placeholder="********"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-100 shadow-sm">Entrar</button>
        </form>

        <!-- Enlace a registro -->
        <div class="text-center mt-3">
          <router-link to="/register" class="text-decoration-none text-primary">
            ¿No tienes cuenta? Regístrate aquí
          </router-link>
        </div>

        <!-- Mensaje de error -->
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
import { login } from '../services/authService'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function submit() {
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Email o contraseña incorrectos'
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
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>

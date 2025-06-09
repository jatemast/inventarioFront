import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/Register.vue' 
import AgregarProducto from '../components/AgregarProducto.vue' 

const routes = [
  { path: '/', redirect: '/login' },
  
  { path: '/login', 
    name: 'Login',
    component: Login 
    },
  { path: '/register', component: Register },
  
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
 {
    path: '/agregar-producto',
    name: 'AgregarProducto',
    component: AgregarProducto,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protege las rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register' || to.path === '/activar-cuenta') && token) {
    // Si ya está autenticado, evita ir a login, registro o activar cuenta
    next('/dashboard')
  } else {
    next()
  }
})

export default router

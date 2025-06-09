 import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

createApp(App)
  .use(router)
  .mount('#app')

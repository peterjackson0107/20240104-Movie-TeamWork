import './assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Popper from "vue3-popper";
import 'bootstrap'
import { register } from 'swiper/element/bundle';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'



const app = createApp(App)

const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')

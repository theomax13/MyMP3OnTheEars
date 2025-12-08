import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import PrimeVue from 'primevue/config'

createApp(App).use(PrimeVue, createPinia).mount('#app')

import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import Ripple from 'primevue/ripple'
import StyleClass from 'primevue/styleclass'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark-mode',
        cssLayer: false
      }
    }
  })

  .directive('ripple', Ripple)
  .directive('styleclass', StyleClass)
  .mount('#app')
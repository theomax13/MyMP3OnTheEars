import { createRouter, createWebHashHistory } from 'vue-router'

import SearchView from '../views/SearchView.vue'
// Tu pourras ajouter HomeView.vue ou LibraryView.vue plus tard

const routes = [
  {
    path: '/',
    redirect: '/search' // Pour l'instant, on redirige l'accueil vers la recherche
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  }
]

const router = createRouter({
  // En Electron, on utilise WebHashHistory pour éviter les problèmes de chemins file://
  history: createWebHashHistory(),
  routes
})

export default router

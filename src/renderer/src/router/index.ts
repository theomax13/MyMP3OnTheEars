import { createRouter, createWebHashHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import LibraryView from '@renderer/views/LibraryView.vue'

const routes = [
  {
    path: '/',
    redirect: '/search'
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: LibraryView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

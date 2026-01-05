<template>
  <div class="card flex justify-content-center">
    <Drawer v-model:visible="sidebarStore.isVisible" style="border-style: none">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full bg-[#1e293b]">
          <!-- EN-TÊTE -->
          <div class="flex items-center justify-between px-6 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <Avatar :image="LOGO" class="mr-2" size="xlarge" shape="circle" />
              <span class="font-semibold text-2xl text-white">MyMP3OnTheEars</span>
            </span>
          </div>

          <!-- MENU (Modification ici : ajout de flex-1) -->
          <div class="overflow-y-auto flex-1">
            <ul class="list-none pt-4 m-0">
              <li>
                <ul class="list-none overflow-hidden">
                  <li>
                    <router-link to="/search" v-ripple class="menu-item p-ripple rounded-full">
                      <i class="pi pi-home mr-2"></i>
                      <span class="font-medium">Accueil</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/playlist" v-ripple class="menu-item p-ripple rounded-full">
                      <i class="pi pi-list mr-2"></i>
                      <span class="font-medium">Playlist</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/discover" v-ripple class="menu-item p-ripple rounded-full">
                      <i class="pi pi-lightbulb mr-2"></i>
                      <span class="font-medium">Découvrir</span>
                    </router-link>
                  </li>
                  <li>
                    <a v-ripple class="menu-item p-ripple rounded-full">
                      <i class="pi pi-cog mr-2"></i>
                      <span class="font-medium">Paramètres</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- FOOTER (Aligné en bas grâce au flex-1 du dessus) -->
          <div class="mt-auto overflow-hidden">
            <hr class="mb-4 mx-4 border-t border-0 border-surface-200 dark:border-surface-700" />
            <a v-ripple class="menu-item m-4 p-ripple">
              <Avatar
                image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                shape="circle"
              />
              <span class="font-bold">The TONTON</span>
            </a>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '@stores/sidebar'
import LOGO from '../assets/img/logo.png'

import Drawer from 'primevue/drawer'
import Avatar from 'primevue/avatar'

// On récupère le store
const sidebarStore = useSidebarStore()
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  color: #e2e8f0;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateX(4px);
}

.menu-item i {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.menu-item:hover i {
  color: #60a5fa;
}
</style>

<script setup lang="ts">
import Drawer from 'primevue/drawer'
import { useSidebarStore } from '@stores/sidebar'

import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

// On récupère le store
const sidebarStore = useSidebarStore()

import LOGO from '../assets/img/logo.png'

</script>

<template>
    <div class="card flex justify-content-center">
        <Drawer  v-model:visible="sidebarStore.isVisible">
            <template #container="{ closeCallback }">
                <div class="flex flex-col h-full sidebar-component">
                    
                    <!-- EN-TÊTE -->
                    <div class="flex items-center justify-between px-6 pt-4 shrink-0">
                        <span class="inline-flex items-center gap-2">
                            <Avatar :image="LOGO" class="mr-2" size="xlarge" shape="circle" />
                            <span class="font-semibold text-2xl text-primary">MyMP3OnTheEars</span>
                        </span>
                    </div>
                    
                    <!-- MENU (Modification ici : ajout de flex-1) -->
                    <div class="overflow-y-auto flex-1">
                        <ul class="list-none p-4 m-0">
                            <li>
                                <ul class="list-none p-0 m-0 overflow-hidden">
                                    <li>
                                        <a v-ripple class="menu-item p-ripple">
                                                <i class="pi pi-home mr-2"></i>
                                            <span class="font-medium">Accueil</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="menu-item p-ripple">                                            <i class="pi pi-bookmark mr-2"></i>
                                            <span class="font-medium">Favoris</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="menu-item p-ripple">
                                            <i class="pi pi-users mr-2"></i>
                                            <span class="font-medium">Playlist</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="menu-item p-ripple">                                            <i class="pi pi-comments mr-2"></i>
                                            <span class="font-medium">Découvrir</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="menu-item p-ripple">
                                            <i class="pi pi-cog mr-2"></i>
                                            <span class="font-medium">Paramètres</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- FOOTER (Aligné en bas grâce au flex-1 du dessus) -->
                    <div class="mt-auto">
                        <hr class="mb-4 mx-4 border-t border-0 border-surface-200 dark:border-surface-700" />
                        <a v-ripple class="menu-item m-4 p-ripple">
                                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                            <span class="font-bold">The TONTON</span>
                        </a>
                    </div>

                </div>
            </template>
        </Drawer>
    </div>
</template>

<style scoped>
.sidebar-component {
background: gray;
}  

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: var(--p-border-radius);
  color: white;
  transition: background-color 0.15s ease;
}

.menu-item:hover {
  background-color: white;
}
</style>

<template>
  <div class="menubar-wrapper">
    <Toast position="top-center" group="tc" />
    <Menubar :model="menubarItems">
      <template #end>
        <span class="px-2">{{ currentTime }}</span>
        <i class="pi pi-minus px-2 clickable-icon" @click="sidebarStore.minimizeWindow()"></i>
        <i class="pi pi-plus rotate-45 px-2 clickable-icon" @click="sidebarStore.closeWindow()"></i>
    </template>
      <template #start>
        <i class="pi pi-bars px-2 clickable-icon" @click="sidebarStore.open()"></i>
    </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Menubar from 'primevue/menubar'
import Toast from 'primevue/toast'
import { useSidebarStore } from '@stores/sidebar'

const sidebarStore = useSidebarStore()
// Heure actuelle
const currentTime = ref('')
onMounted(() => {
  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  updateTime()
  setInterval(updateTime, 1000)
})

const menubarItems = ref([
    // {
    //     label: 'Menu',
    //     icon: 'pi pi-bars',
    //     command: () => {
    //     // Logique pour ouvrir le sidebar
    //     sidebarStore.open()
    //     }
    // }
])
</script>

<style scoped>
.menubar-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  -webkit-app-region: drag; /* Pour déplacer la fenêtre Electron */
}

.menubar-wrapper :deep(.p-menubar) {
  background-color: #1e293b;
  color: white;
  border-radius: 0;
  border: none;
  padding: 0.25rem 0.5rem;
}

/* Les boutons et le menu doivent rester cliquables */
.menubar-wrapper :deep(.p-menubar-button),
.menubar-wrapper :deep(.p-menuitem-link) {
  -webkit-app-region: no-drag;
}



.clickable-icon {
  -webkit-app-region: no-drag;
  cursor: pointer;
}

.clickable-icon:hover {
  opacity: 0.7;
}
</style>

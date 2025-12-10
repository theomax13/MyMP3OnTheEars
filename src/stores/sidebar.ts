import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  // État : la sidebar est-elle visible ?
  const isVisible = ref(false)

  // Actions : fonctions pour modifier l'état
  function open() {
    isVisible.value = true
  }

  function close() {
    isVisible.value = false
  }

  function toggle() {
    isVisible.value = !isVisible.value
  }

  //mainWindows fermeture, minimisation
  function minimizeWindow() {
    window.electron.ipcRenderer.send('window-minimize')
  }

  function closeWindow() {
    window.electron.ipcRenderer.send('window-close')
  }

  // On expose ce qui sera accessible depuis les composants
  return { isVisible, open, close, toggle, minimizeWindow, closeWindow }
})
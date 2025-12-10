<template>
  <div class="app-layout dark-mode w-full">
    <!-- Menu sidebar -->
    <div class="menuBouton">
      <!-- Bouton burger pour ouvrir la sidebar -->
      <button class="fixed top-4 left-4 z-1000" @click="sidebarStore.open()">☰ Menu</button>

      <!-- Votre contenu existant -->
    </div>
    <Sidebar />
    <main class="main-content">
      <!-- Le player caché existe toujours en fond -->

      <!-- Ici s'affichera le contenu de la page actuelle (SearchView, etc.) -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'

import { useSidebarStore } from '@stores/sidebar'

const sidebarStore = useSidebarStore()
</script>

<style>
/* Un peu de style global si tu veux */
body {
  margin: 0;
  background-color: #121212; /* Couleur Spotify sombre */
  color: white;
  font-family: sans-serif;
}
</style>

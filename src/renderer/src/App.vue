<template>
  <div class="app-layout dark-mode w-full">
    <MenuBar />
    <!-- Menu sidebar -->
    <div class="menuBouton">

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
import MenuBar from './components/MenuBar.vue'
import { useSidebarStore } from '@stores/sidebar'
import { usePlaylistStore } from '@stores/usePlaylistStore'

const sidebarStore = useSidebarStore()
const playlistStore = usePlaylistStore()

playlistStore.loadPlaylists()
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

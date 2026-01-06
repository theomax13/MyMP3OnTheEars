<template>
  <div class="h-screen w-screen flex flex-col bg-[#121212] text-white">
    <MenuBar />

    <!-- Conteneur global (Sidebar + Main) -->
    <!-- Note: Sidebar est un Drawer (overlay), donc main prend tout l'espace -->

    <div class="flex-1 relative overflow-hidden flex flex-col">
      <Sidebar />

      <main class="flex-1 overflow-hidden relative pb-[90px]">
        <!-- Ici s'affichera le contenu de la page actuelle -->
        <router-view />
      </main>
      
      <!-- Lecteur Audio Global -->
      <DockComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import MenuBar from './components/MenuBar.vue'
import DockComponent from './components/DockComponent.vue'
import { usePlaylistStore } from '@stores/usePlaylistStore'

// const sidebarStore = useSidebarStore()
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

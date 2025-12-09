<template>
  <div class="app-layout dark-mode">

    <Sidebar />
    <!-- Le player caché existe toujours en fond -->
    <YouTubePlayer />

    <!-- Ici s'affichera le contenu de la page actuelle (SearchView, etc.) -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import YouTubePlayer from './components/YouTubePlayer.vue'
import Sidebar from './components/Sidebar.vue'
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

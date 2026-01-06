<template>
  <div class="h-screen w-screen flex flex-col bg-[#121212] text-white">
    <MenuBar />
    <Toast position="top-right" />

    <div class="flex-1 relative overflow-hidden flex flex-col">
      <Sidebar />

      <main class="flex-1 overflow-hidden relative pb-[90px]">
        <router-view />
      </main>
      
      <DockComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import MenuBar from './components/MenuBar.vue'
import DockComponent from './components/DockComponent.vue'
import Toast from 'primevue/toast'
import { usePlaylistStore } from '@stores/usePlaylistStore'

const playlistStore = usePlaylistStore()

playlistStore.loadPlaylists()
</script>

<style>
body {
  margin: 0;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
}
</style>

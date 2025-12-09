<template>
  // Menu sidebar
   <div class="menuBouton" >
    <!-- Bouton burger pour ouvrir la sidebar -->
    <button class="fixed top-4 left-4 z-1000" @click="sidebarStore.open()">
      ☰ Menu
    </button>
    
    <!-- Votre contenu existant -->
  </div>

  <div class="p-6">
    
    <h1 class="text-2xl font-bold mb-4">Recherche</h1>

    <!-- Barre de recherche -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="searchQuery"
        @keyup.enter="performSearch"
        type="text"
        placeholder="Chercher un titre..."
        class="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <button
        @click="performSearch"
        class="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400"
      >
        Go
      </button>
    </div>

    <!-- Résultats -->
    <div v-if="isLoading" class="text-gray-400">Chargement...</div>

    <div v-else class="grid gap-4">
      <div
        v-for="track in results"
        :key="track.id"
        @click="playTrack(track)"
        class="flex items-center gap-4 p-3 bg-gray-900/50 hover:bg-gray-800 rounded cursor-pointer transition"
      >
        <img :src="track.thumbnail" class="w-16 h-16 object-cover rounded" />
        <div>
          <h3 class="font-bold text-white">{{ track.title }}</h3>
          <p class="text-sm text-gray-400">{{ track.channel }} • {{ track.duration }}</p>
        </div>
      </div>
    </div>
  </div>

  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'

const searchQuery = ref('')
const results = ref<any[]>([])
const isLoading = ref(false)
const playerStore = usePlayerStore()

async function performSearch() {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  try {
    // Appel via le bridge qu'on a créé
    results.value = await window.api.searchYouTube(searchQuery.value)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function playTrack(track: any) {
  // Mise à jour du store -> déclenche le player caché
  playerStore.setCurrentTrack(track)
  playerStore.play()
}

import { useSidebarStore } from '@stores/sidebar'

const sidebarStore = useSidebarStore()

</script>



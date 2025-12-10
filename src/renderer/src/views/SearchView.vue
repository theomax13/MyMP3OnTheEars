<template>
  <div class="search-view-container">
    <div class="flex">
      <YouTubePlayer />
      <div class="search-content">
        <!-- Barre de recherche fixe en haut -->
        <div class="search-header">
          <h1 class="text-2xl font-bold mb-4">Recherche</h1>
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
        </div>

        <!-- Résultats avec scroll -->
        <div v-if="isLoading" class="text-gray-400">Chargement...</div>

        <div v-else class="results-container">
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
    </div>
    <DockComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'
import YouTubePlayer from '../components/YouTubePlayer.vue'
import DockComponent from '../components/DockComponent.vue'

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
</script>

<style scoped>
.search-view-container {
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
  padding: 1rem;
}

/* La partie recherche + résultats prend le reste */
.search-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-header {
  flex-shrink: 0; /* Ne se réduit pas */
  margin-bottom: 1rem;
  padding: 2rem;
}

.results-container {
  flex: 1;
  overflow-y: auto; /* Active le scroll vertical */
  display: grid;
  gap: 1rem;
  padding-right: 0.5rem; /* Espace pour la scrollbar */
  margin-bottom: 1rem; /* Espace de 1rem avant la barre de lecture */
  max-height: calc(100vh - 300px); /* Hauteur max pour éviter chevauchement */
}

/* Style de la scrollbar (optionnel) */
.results-container::-webkit-scrollbar {
  width: 8px;
}

.results-container::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 4px;
}

.results-container::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.results-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>

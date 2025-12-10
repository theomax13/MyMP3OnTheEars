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
            class="flex items-center place-content-between p-3 bg-gray-900/50 hover:bg-gray-800 rounded cursor-pointer transition"
          >
            <div class="flex gap-4 items-center">
              <img :src="track.thumbnail" class="w-16 h-16 object-cover rounded" />
              <div>
                <h3 class="font-bold text-white">{{ track.title }}</h3>
                <p class="text-sm text-gray-400">{{ track.channel }} • {{ track.duration }}</p>
              </div>
            </div>
            <div>
              <button
                @click.stop="addToFavorites(track)"
                class="p-3 rounded-full hover:bg-white/10 transition-colors"
                :class="isFavorite(track) ? 'text-green-500' : 'text-gray-400 hover:text-white'"
                title="Ajouter aux favoris"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  v-if="isFavorite(track)"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  v-else
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  ></path>
                </svg>
              </button>
              <button
                @click.stop="openPlaylistModal(track)"
                class="p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Ajouter à une playlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddToPlaylistModal
      :is-open="isModalOpen"
      :track-to-add="selectedTrack"
      @close="isModalOpen = false"
    />
    <DockComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'
import { usePlaylistStore } from '@stores/usePlaylistStore'
import YouTubePlayer from '../components/YouTubePlayer.vue'
import DockComponent from '../components/DockComponent.vue'
import AddToPlaylistModal from '../components/AddToPlaylistModal.vue'

const searchQuery = ref('')
const results = ref<any[]>([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const selectedTrack = ref(null)
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

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

function addToFavorites(track: any) {
  // On appelle l'action toggleFavorite du store qu'on a créé tout à l'heure
  playlistStore.toggleFavorite(track)
}

function isFavorite(track: any) {
  // Vérifie si le titre est déjà dans la liste des favoris
  return playlistStore.favorites.some((t) => t.id === track.id)
}

function openPlaylistModal(track: any) {
  selectedTrack.value = track
  isModalOpen.value = true
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

<template>
  <div class="search-view-container">
    <div class="flex flex-1 overflow-hidden">
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
              class="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500 transition-colors"
            />
            <button
              @click="performSearch"
              class="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
            >
              <span class="pi pi-search"></span>
            </button>
          </div>
        </div>

        <!-- État Chargement Initial -->
        <div v-if="isLoading" class="text-gray-400 p-8 text-center">
          <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
          <p>Recherche en cours...</p>
        </div>

        <!-- Liste des Résultats -->
        <div
          v-else
          class="results-container custom-scrollbar"
          ref="scrollContainer"
          @scroll="handleScroll"
        >
          <div
            v-for="track in results"
            :key="track.id"
            @click="playTrack(track)"
            class="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group mb-2"
          >
            <!-- Info Track (Gauche) -->
            <div class="flex gap-4 items-center overflow-hidden">
              <div class="relative w-16 h-16 flex-shrink-0">
                <img :src="track.thumbnail" class="w-full h-full object-cover rounded shadow-md" />
                <!-- Overlay Play au survol -->
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <i class="pi pi-play-circle text-white text-2xl"></i>
                </div>
              </div>

              <div class="overflow-hidden">
                <h3 class="font-bold text-white truncate pr-4">{{ track.title }}</h3>
                <p class="text-sm text-gray-400 truncate">
                  {{ track.channel }} • {{ track.duration }}
                </p>
              </div>
            </div>

            <!-- Actions (Droite) -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <!-- Bouton Favori -->
              <button
                @click.stop="addToFavorites(track)"
                class="p-2 rounded-full hover:bg-white/10 transition-colors"
                :class="isFavorite(track) ? 'text-green-500' : 'text-gray-400 hover:text-white'"
                title="Ajouter aux favoris"
              >
                <i
                  :class="isFavorite(track) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                  style="font-size: 1.2rem"
                ></i>
              </button>

              <!-- Bouton Playlist -->
              <button
                @click.stop="openPlaylistModal(track)"
                class="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Ajouter à une playlist"
              >
                <i class="pi pi-plus" style="font-size: 1.2rem"></i>
              </button>
            </div>
          </div>

          <!-- Loader Infinite Scroll -->
          <div
            v-if="isLoadingMore"
            class="py-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2"
          >
            <i class="pi pi-spin pi-spinner"></i> Chargement de la suite...
          </div>

          <div
            v-if="results.length > 0 && !continuationToken && !isLoadingMore"
            class="py-8 text-center text-gray-600 italic text-sm"
          >
            Fin des résultats
          </div>
        </div>
      </div>
    </div>

    <!-- Modale et Dock -->
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

// États
const searchQuery = ref('')
const results = ref<any[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const continuationToken = ref<any>(null) // Pour la pagination
const scrollContainer = ref<HTMLElement | null>(null)

// Modale & Stores
const isModalOpen = ref(false)
const selectedTrack = ref(null)
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

// --- RECHERCHE & PAGINATION ---

async function performSearch() {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  continuationToken.value = null
  results.value = [] // Reset de la liste

  try {
    // Appel initial
    const response = await (window.api as any).searchYouTube({ query: searchQuery.value })
    results.value = response.items
    continuationToken.value = response.continuation
  } catch (e) {
    console.error('Erreur recherche', e)
  } finally {
    isLoading.value = false
  }
}

async function loadMore() {
  if (isLoadingMore.value || !continuationToken.value) return

  isLoadingMore.value = true
  try {
    // Appel page suivante
    const response = await (window.api as any).searchYouTube({ query: searchQuery.value })

    // Ajout des résultats à la suite
    results.value.push(...response.items)
    continuationToken.value = response.continuation
  } catch (e) {
    console.error('Erreur pagination', e)
  } finally {
    isLoadingMore.value = false
  }
}

function handleScroll() {
  const el = scrollContainer.value
  if (!el) return

  // Détection bas de page (marge de 100px)
  const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100

  if (isBottom) {
    loadMore()
  }
}

// --- ACTIONS UI ---

function playTrack(track: any) {
  // Ici on lance une "Playlist contextuelle" créée à la volée à partir des résultats de recherche
  // Comme ça "Suivant" marchera aussi dans la recherche !
  const index = results.value.indexOf(track)
  playerStore.playContext(results.value, index)
}

function addToFavorites(track: any) {
  playlistStore.toggleFavorite(track)
}

function isFavorite(track: any) {
  return playlistStore.favorites.some((t) => t.id === track.id)
}

function openPlaylistModal(track: any) {
  selectedTrack.value = track
  isModalOpen.value = true
}
</script>

<style scoped>
.search-view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;
}

.search-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-bottom: 0; /* Le padding-bottom est géré par results-container pour le dock */
}

.search-header {
  flex-shrink: 0;
  margin-bottom: 1rem;
}

.results-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  padding-bottom: 120px; /* Espace crucial pour que le dernier item ne soit pas caché par le Dock */
  max-height: calc(100vh - 300px);
}

/* Scrollbar Custom */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>

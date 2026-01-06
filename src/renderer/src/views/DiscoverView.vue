<template>
  <div class="discover-view-container">
    <div class="flex flex-1 overflow-hidden relative">
      <YouTubePlayer />

      <div class="discover-content">
        <!-- En-tête Fixe : Titre + Barre de recherche -->
        <div class="discover-header shrink-0 pt-6 px-6 pb-2 z-10 bg-[#121212]">
          <h1 class="text-2xl font-bold mb-4">Découvrir</h1>
          <p class="text-gray-400 mb-6 text-sm">
            Explorez des playlists YouTube et lancez-les instantanément.
          </p>

          <div class="flex gap-2 mb-2">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Ex: Nouveautés 2024, Hits été, Jazz relax..."
              class="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              @click="performSearch"
              class="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              <i class="pi pi-search"></i>
            </button>
          </div>
        </div>

        <!-- Zone Scrollable Unique (Suggestions + Résultats) -->
        <div
          class="scroll-content flex-1 overflow-y-auto px-6 pb-32 custom-scrollbar"
          ref="scrollContainer"
          @scroll="handleScroll"
        >
          <!-- Suggestions de Playlists (Visibles si pas de recherche ni résultats) -->
          <div class="mt-6 mb-8" v-if="!searchQuery && results.length === 0 && !isLoading">
            <h2 class="text-lg font-semibold mb-4 text-gray-200">Suggestions pour vous</h2>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                @click="loadQuickPlaylist(suggestion)"
                class="cursor-pointer bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600 group relative overflow-hidden"
              >
                <!-- Effet de fond subtil -->
                <div
                  class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity"
                  :class="suggestion.color"
                ></div>

                <div class="relative z-10 flex items-center justify-between">
                  <span class="font-bold text-white text-sm">{{ suggestion.title }}</span>
                  <span class="text-xl">{{ suggestion.icon }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- État Chargement -->
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center text-gray-400 py-12"
          >
            <i class="pi pi-spin pi-spinner text-3xl mb-4"></i>
            <p class="text-sm">Récupération des playlists...</p>
          </div>

          <!-- Liste des Résultats -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="playlist in results"
              :key="playlist.id"
              class="group bg-gray-900/50 hover:bg-gray-800 rounded-lg p-3 transition-colors cursor-pointer border border-transparent hover:border-gray-700 flex flex-col"
              @click="playPlaylist(playlist)"
            >
              <!-- Image -->
              <div
                class="relative w-full aspect-video mb-3 overflow-hidden rounded-md bg-gray-800 shrink-0"
              >
                <img :src="playlist.thumbnail" class="w-full h-full object-cover" />

                <!-- Overlay Play -->
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <button
                    class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                  >
                    <i class="pi pi-play text-lg ml-1"></i>
                  </button>
                </div>

                <!-- Badge Count -->
                <div
                  class="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1"
                >
                  <i class="pi pi-list text-[10px]"></i>
                  {{ playlist.length }}
                </div>
              </div>

              <!-- Content Info -->
              <div class="flex-1 flex flex-col min-w-0">
                <h3 class="font-bold text-white truncate text-sm mb-1" :title="playlist.title">
                  {{ playlist.title }}
                </h3>
                <p class="text-xs text-gray-400 truncate mb-2">{{ playlist.channel }}</p>
                <div
                  class="mt-auto flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity pt-2"
                >
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-500"
                    >Playlist</span
                  >
                  <a
                    :href="playlist.url"
                    target="_blank"
                    @click.stop
                    class="text-gray-400 hover:text-white"
                    title="Ouvrir sur YouTube"
                  >
                    <i class="pi pi-external-link text-xs"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Loader Infinite Scroll -->
          <div
            v-if="isLoadingMore"
            class="py-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2"
          >
            <i class="pi pi-spin pi-spinner"></i>
          </div>

          <!-- État Vide -->
          <div
            v-if="results.length === 0 && !isLoading && searchQuery"
            class="text-center py-20 text-gray-500"
          >
            <i class="pi pi-search-minus text-4xl mb-4 opacity-30"></i>
            <p class="text-sm">Aucune playlist trouvée pour "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'
import YouTubePlayer from '../components/YouTubePlayer.vue'

const playerStore = usePlayerStore()

// États
const searchQuery = ref('')
const results = ref<any[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const continuationToken = ref<any>(null)
const scrollContainer = ref<HTMLElement | null>(null)

// Suggestions
const suggestions = [
  {
    id: '1',
    title: 'Top Hits 2024',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
    query: 'Top Hits Global 2024'
  },
  {
    id: '2',
    title: 'Nouveautés',
    icon: '✨',
    color: 'from-purple-500 to-indigo-600',
    query: 'New Releases Music 2024'
  },
  {
    id: '3',
    title: 'Hits Été',
    icon: '☀️',
    color: 'from-yellow-400 to-orange-500',
    query: 'Summer Hits 2024'
  },
  {
    id: '4',
    title: 'Ambiance Soirée',
    icon: '🎉',
    color: 'from-pink-500 to-purple-600',
    query: 'Party Dance Mix 2024'
  },
  {
    id: '5',
    title: 'Lo-Fi Chill',
    icon: '☕',
    color: 'from-teal-400 to-blue-500',
    query: 'Chill Lo-fi Beats'
  },
  {
    id: '6',
    title: 'Travail Focus',
    icon: '💻',
    color: 'from-blue-600 to-cyan-500',
    query: 'Deep Focus Music'
  },
  {
    id: '7',
    title: 'Jazz Relax',
    icon: '🎷',
    color: 'from-amber-600 to-orange-800',
    query: 'Relaxing Jazz Masterpieces'
  },
  {
    id: '8',
    title: 'Rock Classics',
    icon: '🎸',
    color: 'from-red-700 to-black',
    query: 'Best Rock Songs of all time'
  }
]

// --- RECHERCHE ---

async function performSearch() {
  if (!searchQuery.value.trim()) {
    results.value = []
    continuationToken.value = null
    return
  }

  isLoading.value = true
  continuationToken.value = null
  results.value = []

  try {
    const response = await (window.api as any).searchYouTube({
      query: searchQuery.value,
      type: 'Playlist'
    })
    results.value = response.items
    continuationToken.value = response.continuation
  } catch (e) {
    console.error('Erreur recherche playlists', e)
  } finally {
    isLoading.value = false
  }
}

async function loadQuickPlaylist(suggestion: any) {
  searchQuery.value = suggestion.query
  await performSearch()
}

// --- ACTIONS LECTURE ---

async function playPlaylist(playlist: any) {
  isLoading.value = true
  try {
    const data = await (window.api as any).getPlaylist(playlist.id)

    if (data && data.items && data.items.length > 0) {
      playerStore.playContext(data.items, 0)
    } else {
      console.warn('Playlist vide ou inaccessible')
    }
  } catch (e) {
    console.error('Erreur lors du lancement de la playlist', e)
  } finally {
    isLoading.value = false
  }
}

// --- PAGINATION ---

async function loadMore() {
  if (isLoadingMore.value || !continuationToken.value) return

  isLoadingMore.value = true
  try {
    const response = await (window.api as any).searchYouTube({
      query: searchQuery.value,
      continuation: continuationToken.value,
      type: 'Playlist'
    })

    results.value.push(...response.items)
    continuationToken.value = response.continuation
  } catch (e) {
    console.error('Erreur pagination playlists', e)
  } finally {
    isLoadingMore.value = false
  }
}

function handleScroll() {
  const el = scrollContainer.value
  if (!el) return
  const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200
  if (isBottom) {
    loadMore()
  }
}
</script>

<style scoped>
.discover-view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;
  color: #fff;
}

.discover-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important pour que le child scroll */
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

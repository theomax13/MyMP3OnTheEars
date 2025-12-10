<template>
  <div class="library-container">
    <div class="p-12 pb-24">
      <!-- Padding bottom pour éviter que le dock cache le contenu -->
      <h1 class="text-3xl font-bold mb-8">Ma Bibliothèque</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- SECTION 1 : FAVORIS (COEUR) -->
        <div class="bg-gray-900/30 p-4 rounded-xl border border-gray-800">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            Titres Likés ({{ playlistStore.favorites.length }})
          </h2>

          <div v-if="playlistStore.favorites.length === 0" class="text-gray-500 italic text-sm">
            Vos titres favoris apparaîtront ici.
          </div>

          <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="track in playlistStore.favorites"
              :key="track.id"
              class="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <!-- Clic sur l'image ou le texte pour jouer -->
              <div
                class="flex flex-1 items-center gap-3"
                @click="
                  playPlaylistContext(
                    playlistStore.favorites,
                    playlistStore.favorites.indexOf(track)
                  )
                "
              >
                <img :src="track.thumbnail" class="w-10 h-10 rounded object-cover shadow-sm" />
                <div class="overflow-hidden">
                  <div class="font-medium text-sm truncate text-white">{{ track.title }}</div>
                  <div class="text-xs text-gray-400 truncate">{{ track.channel }}</div>
                </div>
              </div>

              <!-- Bouton Supprimer (visible au survol) -->
              <button
                @click.stop="playlistStore.toggleFavorite(track)"
                class="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                title="Retirer des favoris"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- SECTION 2 : PLAYLISTS PERSO -->
        <div class="bg-gray-900/30 p-4 rounded-xl border border-gray-800">
          <div class="flex justify-between items-center pb-4">
            <h2 class="text-xl font-bold flex items-center gap-2 text-purple-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              Mes Playlists
            </h2>
          </div>

          <!-- Création rapide -->
          <div class="flex gap-2 pb-4">
            <input
              v-model="newListName"
              @keyup.enter="createList"
              placeholder="Nouvelle playlist..."
              class="flex-1 bg-gray-800 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              @click="createList"
              class="bg-purple-600 hover:bg-purple-500 px-3 rounded text-white font-bold transition-colors"
              :disabled="!newListName"
            >
              +
            </button>
          </div>

          <div v-if="playlistStore.playlists.length === 0" class="text-gray-500 italic text-sm">
            Créez des playlists pour organiser vos morceaux.
          </div>

          <!-- Liste des playlists (Accordéon simple) -->
          <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div
              v-for="playlist in playlistStore.playlists"
              :key="playlist.id"
              class="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50"
            >
              <!-- En-tête de la playlist -->
              <div class="p-3 flex justify-between items-center bg-gray-800">
                <h3 class="font-bold text-white">{{ playlist.name }}</h3>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded-full">{{
                    playlist.tracks.length
                  }}</span>
                  <button
                    @click="playlistStore.deletePlaylist(playlist.id)"
                    class="text-gray-500 hover:text-red-500 transition-colors"
                    title="Supprimer la playlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Liste des sons dans la playlist -->
              <div class="p-2 space-y-1">
                <div
                  v-if="playlist.tracks.length === 0"
                  class="text-xs text-gray-500 italic p-2 text-center"
                >
                  Playlist vide
                </div>

                <div
                  v-for="(track, index) in playlist.tracks"
                  :key="track.id"
                  @click="playPlaylistContext(playlist.tracks, index)"
                  class="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer group"
                >
                  <img
                    :src="track.thumbnail"
                    class="w-8 h-8 rounded object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span
                    class="truncate text-sm text-gray-300 group-hover:text-white transition-colors flex-1"
                    >{{ track.title }}</span
                  >

                  <!-- Petit bouton play au survol -->
                  <svg
                    class="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
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
import { usePlaylistStore } from '@stores/usePlaylistStore'
import { usePlayerStore } from '@stores/usePlayerStore'
import DockComponent from '../components/DockComponent.vue'

const playlistStore = usePlaylistStore()
const playerStore = usePlayerStore()
const newListName = ref('')

function playTrack(track: any) {
  playerStore.setCurrentTrack(track)
  playerStore.play()
}

function playPlaylistContext(tracks: any[], index: number) {
  playerStore.playContext(tracks, index)
}

async function createList() {
  if (newListName.value.trim()) {
    await playlistStore.createPlaylist(newListName.value)
    newListName.value = ''
  }
}
</script>

<style scoped>
.library-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto; /* Scroll global pour la page */
  background-color: #121212;
}

/* Scrollbar personnalisée fine */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>

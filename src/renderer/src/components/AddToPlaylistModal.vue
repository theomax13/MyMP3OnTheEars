<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-gray-800 p-6 rounded-lg w-96 shadow-xl border border-gray-700">
      <h2 class="text-xl font-bold mb-4">Ajouter à une playlist</h2>

      <!-- Liste des playlists existantes -->
      <div class="mb-4 max-h-60 overflow-y-auto">
        <div
          v-for="playlist in playlistStore.playlists"
          :key="playlist.id"
          @click="selectPlaylist(playlist.id)"
          class="p-3 hover:bg-gray-700 rounded cursor-pointer flex justify-between items-center mb-2"
        >
          <span>{{ playlist.name }}</span>
          <span class="text-xs text-gray-400">{{ playlist.tracks.length }} titres</span>
        </div>

        <div
          v-if="playlistStore.playlists.length === 0"
          class="text-gray-500 text-sm text-center py-4"
        >
          Aucune playlist perso.
        </div>
      </div>

      <!-- Créer une nouvelle playlist -->
      <div class="border-t border-gray-700 pt-4">
        <div class="flex gap-2">
          <input
            v-model="newPlaylistName"
            @keyup.enter="createNew"
            placeholder="Nouvelle playlist..."
            class="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm"
          />
          <button
            @click="createNew"
            class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm font-bold"
            :disabled="!newPlaylistName"
          >
            +
          </button>
        </div>
      </div>

      <button @click="close" class="mt-4 text-gray-400 hover:text-white text-sm w-full text-center">
        Annuler
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlaylistStore } from '@stores/usePlaylistStore'

const props = defineProps<{
  isOpen: boolean
  trackToAdd: any // Le son qu'on veut ajouter
}>()

const emit = defineEmits(['close'])
const playlistStore = usePlaylistStore()
const newPlaylistName = ref('')

function close() {
  emit('close')
  newPlaylistName.value = ''
}

async function createNew() {
  if (!newPlaylistName.value.trim()) return
  await playlistStore.createPlaylist(newPlaylistName.value)
  newPlaylistName.value = ''
}

async function selectPlaylist(playlistId: string) {
  if (props.trackToAdd) {
    await playlistStore.addToPlaylist(playlistId, props.trackToAdd)
    close() // On ferme après l'ajout
  }
}
</script>

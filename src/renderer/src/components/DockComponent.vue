<template>
  <div class="spotify-footer">
    <!-- 1. GAUCHE : Infos Track & Like -->
    <div class="flex items-center gap-4 w-1/3">
      <div v-if="playerStore.currentTrack" class="flex items-center gap-3">
        <!-- Image qui tourne si ça joue -->
        <img
          :src="playerStore.currentTrack.thumbnail"
          class="w-14 h-14 rounded-full shadow-lg object-cover transition-transform duration-[10s] ease-linear"
          :class="{ 'rotate-animation': playerStore.isPlaying }"
        />

        <div class="flex flex-col justify-center overflow-hidden">
          <span class="text-white font-bold text-sm truncate max-w-[150px]">
            {{ playerStore.currentTrack.title }}
          </span>
          <span class="text-gray-400 text-xs truncate max-w-[150px]">
            {{ playerStore.currentTrack.channel }}
          </span>
        </div>

        <!-- Bouton Like -->
        <button
          @click="
            playlistStore.toggleFavorite({
              ...playerStore.currentTrack,
              duration: String(playerStore.currentTrack.duration)
            })
          "
          class="ml-2 text-gray-400 hover:text-green-500 transition-colors"
          :class="{ 'text-green-500': isLiked }"
          title="Ajouter aux favoris"
        >
          <i :class="isLiked ? 'pi pi-heart-fill' : 'pi pi-heart'" style="font-size: 1rem"></i>
        </button>
      </div>

      <div v-else class="text-gray-500 text-sm italic ml-4">Prêt à jouer 🎵</div>
    </div>

    <!-- 2. CENTRE : Tes contrôles PrimeVue (Dock) -->
    <div class="w-1/3 flex justify-center">
      <div class="music-controls">
        <Dock :model="controlButtons" style="background: none; border: none">
          <template #item="{ item }">
            <button @click="item.command" class="control-button" :title="item.label">
              <i :class="item.icon" style="font-size: 1.5rem"></i>
            </button>
          </template>
        </Dock>
      </div>
    </div>

    <!-- 3. DROITE : Volume -->
    <div class="w-1/3 flex items-center justify-end pr-6 gap-3">
      <i class="pi pi-volume-up text-gray-400"></i>
      <div class="w-32">
        <Slider v-model="volume" :min="0" :max="100" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'

import { ref } from 'vue'
import { usePlaylistStore } from '@stores/usePlaylistStore' // N'oublie pas d'importer ça pour le Like

import Dock from 'primevue/dock'
import Slider from 'primevue/slider'

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()
const volume = ref(50)

// Gestion du volume
watch(volume, (newVol) => {
  playerStore.setVolume(Number(newVol))
})

// Est-ce liké ?
const isLiked = computed(() => {
  if (!playerStore.currentTrack) return false
  return playlistStore.favorites.some((t) => t.id === playerStore.currentTrack?.id)
})

// Gestion Espace = Play/Pause
const handleSpacebar = (event: KeyboardEvent) => {
  if (event.code === 'Space' && (event.target as HTMLElement).tagName !== 'INPUT') {
    // Évite de bloquer la barre de recherche
    event.preventDefault()
    if (playerStore.isPlaying) playerStore.pause()
    else playerStore.play()
  }
}

onMounted(() => document.addEventListener('keydown', handleSpacebar))
onUnmounted(() => document.removeEventListener('keydown', handleSpacebar))

// Tes boutons (J'ai retiré le volume d'ici pour le mettre à droite)
const controlButtons = ref([
  {
    label: 'Précédent',
    icon: 'pi pi-step-backward',
    command: () => playerStore.playPrevious()
  },
  {
    label: 'Play/Pause',
    // L'icône réactive grâce à computed
    icon: computed(() => (playerStore.isPlaying ? 'pi pi-pause' : 'pi pi-play')),
    command: () => {
      playerStore.isPlaying ? playerStore.pause() : playerStore.play()
    }
  },
  {
    label: 'Suivant',
    icon: 'pi pi-step-forward',
    command: () => playerStore.playNext()
  }
])
</script>

<style scoped>
/* Container principal (Footer fixe) */
.spotify-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background-color: #1e293b; /* Ton gris-bleu foncé */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  padding: 0 1rem;
}

/* Animation Vinyle */
.rotate-animation {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.music-controls :deep(.p-dock-list) {
  background: none;
  border: none;
  gap: 1.5rem;
}

.music-controls :deep(.p-dock-list-container) {
  background: none;
  border: none;
  background-color: none;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 50px;
  height: 50px;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.control-button:active {
  transform: scale(0.95);
}


.dock-demo .p-menubar {
    padding: 0;
    border-radius: 0;

/* Ajustement slider PrimeVue */
:deep(.p-slider) {
  background: #475569;
}
:deep(.p-slider-range) {
  background-color: #10b981; /* Vert Spotify */
}
</style>

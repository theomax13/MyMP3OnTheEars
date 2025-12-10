<template>
  <!-- Contrôles de lecture avec Dock -->
    <div class="music-controls">
      <Dock :model="controlButtons">
          <template class="place-content-around" #item="{ item }">
            <div></div>
            <button v-if="!item.isSlider" @click="item.command" class="control-button" :title="item.label">
              <i :class="item.icon" style="font-size: 1.5rem"></i>
            </button>           
            <div v-if="item.isSlider" class="flex items-center gap-2 px-3">
               <span class="pi pi-volume-up"></span>
              <Slider v-model="volume" :min="0" :max="100" :step="0.01" class="w-56" />
            </div>
          </template>   
      </Dock>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'
import { ref } from 'vue'
import Dock from 'primevue/dock'
import Slider from 'primevue/slider'
import { watch } from 'vue'

const volume = ref(50) // Initial volume (0-1)

watch(volume, (newVol) => {
  // Si votre playerStore a une méthode pour changer le volume
  if (playerStore.setVolume) {
    playerStore.setVolume(newVol)
  }
  // Ou si vous accédez directement à l'audio element
  // playerStore.audioElement.volume = newVol
})

const playerStore = usePlayerStore()

const handleSpacebar = (event: KeyboardEvent) => {
  // Prevent page scroll
  if (event.code === 'Space') {
    event.preventDefault()
    event.stopPropagation()
    
    // Execute your play/pause logic
    if (playerStore.isPlaying) {
      playerStore.pause()
    } else {
      playerStore.play()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleSpacebar)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleSpacebar)
})

const value = ref(null);

// Définition des boutons de contrôle
const controlButtons = ref([
  {
    label: 'Précédent',
    icon: 'pi pi-step-backward',
    command: () => {
      console.log('Piste précédente')
      // TODO: playerStore.playPrevious()
    }
  },
  {
    label: 'Play/Pause',
    icon: computed(() => (playerStore.isPlaying ? 'pi pi-pause' : 'pi pi-play')),
    command: () => {
      if (playerStore.isPlaying) {
        playerStore.pause()
      } else {
        playerStore.play()
      }
    }
  },
  {
    label: 'Suivant',
    icon: 'pi pi-step-forward',
    command: () => {
      console.log('Piste suivante')
      // TODO: playerStore.playNext()
    }
  },  
  {
    label: 'Volume',
    isSlider: true,
  }
])
</script>

<style scoped>
.music-controls {
  width: 100%; /* Prend toute la largeur */
  display: flex;
  justify-content: center;
}

.music-controls :deep(.p-dock) {
  background: #1e293b; /* Fond coloré uni (gris-bleu foncé) */
  border: none;
  width: 100%;
  padding: 1rem; /* Espacement intérieur */
}

.music-controls :deep(.p-dock-list) {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem; /* Espacement entre les boutons */
  border: none;
}

.music-controls :deep(.p-dock-list-container) {
  background-color: none;
  background: none;
  border: none;
}

.control-button {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 10%;
  transition: all 0.2s ease;
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
}
</style>

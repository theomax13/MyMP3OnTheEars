<template>
  <!-- Player YouTube caché -->
  <div id="yt-player-container" style="width: 1px; height: 1px; position: absolute; opacity: 0; pointer-events: none;"></div>
    
  <!-- Cover affichée -->
<div class="player-wrapper">
  <div class="music-cover" v-if="currentTrack">
    <img :src="getThumbnail(currentTrack.id)" :alt="currentTrack.title" />
    <div class="track-info">
      <h3>{{ currentTrack.title }}</h3>
      <p>{{ currentTrack.artist || 'Artiste inconnu' }}</p>
    </div>
  </div>
  
  <!-- Placeholder quand pas de musique -->
  <div class="music-cover placeholder" v-else>
    <div class="no-track">
      <i class="pi pi-music" style="font-size: 4rem; opacity: 0.3;"></i>
      <p>Aucune piste en lecture</p>
    </div>
  </div>

  <!-- Contrôles de lecture avec Dock -->
  <div class="music-controls">
    <Dock :model="controlButtons">
      <template #item="{ item }">
        <button 
          @click="item.command" 
          class="control-button"
          :title="item.label"
        >
          <i :class="item.icon" style="font-size: 1.5rem;"></i>
        </button>
      </template>
    </Dock>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'
import Dock from 'primevue/dock'

const playerStore = usePlayerStore()
const currentTrack = computed(() => playerStore.currentTrack)

let timeInterval: number | null = null

// Fonction pour générer la thumbnail YouTube
function getThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

function loadYouTubeIframeAPI() {
  return new Promise<void>((resolve) => {
    if ((window as any).YT && (window as any).YT.Player) {
      resolve()
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
    ;(window as any).onYouTubeIframeAPIReady = () => {
      resolve()
    }
  })
}

onMounted(async () => {
  await loadYouTubeIframeAPI()

  const player = new (window as any).YT.Player('yt-player-container', {
    height: '1',  // Taille minimale
    width: '1',   // Taille minimale
    videoId: playerStore.currentTrack?.id ?? '',
    playerVars: {
      autoplay: 0,
      controls: 0
    },
    events: {
      onReady: (event: any) => {
        playerStore.setPlayerInstance(event.target)
        playerStore.setVolume(playerStore.volume)
      },
      onStateChange: (event: any) => {
        const state = event.data

        if (state === (window as any).YT.PlayerState.PLAYING) {
          playerStore.setIsPlaying(true)
        }

        if (state === (window as any).YT.PlayerState.PAUSED) {
          playerStore.setIsPlaying(false)
        }

        if (state === (window as any).YT.PlayerState.ENDED) {
          playerStore.setIsPlaying(false)
          // TODO : appeler une action du store pour passer à la piste suivante
        }

        // Démarrer l'interval seulement une fois
        if (timeInterval === null) {
          timeInterval = window.setInterval(() => {
            if (playerStore.isPlaying && playerStore.playerInstance) {
              const t = playerStore.playerInstance.getCurrentTime()
              playerStore.setCurrentTime(Math.floor(t))
            }
          }, 1000)
        }
      },
      onError: (event: any) => {
        console.error('YouTube error', event.data)
      }
    }
  })
})

// Nettoyer l'interval quand le composant est détruit
onUnmounted(() => {
  if (timeInterval !== null) {
    clearInterval(timeInterval)
    timeInterval = null
  }
})
import { ref } from 'vue'

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
    icon: computed(() => playerStore.isPlaying ? 'pi pi-pause' : 'pi pi-play'),
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
  }
])
</script>

<style scoped>
.music-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.music-cover img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}

.music-cover img:hover {
  transform: scale(1.05);
}

.track-info {
  text-align: center;
}

.track-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.track-info p {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0.5rem 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.placeholder {
  opacity: 0.6;
}

.no-track {
  text-align: center;
  color: #64748b;
}

.no-track p {
  margin-top: 1rem;
  font-size: 1rem;
}

.player-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;  /* Centre horizontalement */
  gap: 1rem;
  padding: 2rem;
}

.music-controls {
  width: 100%;
  display: flex;
  justify-content: center;  /* Centre le Dock */
}
.music-controls :deep(.p-dock) {
  background: grey !important;
}
.control-button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.control-button:active {
  transform: scale(0.95);
}

</style>
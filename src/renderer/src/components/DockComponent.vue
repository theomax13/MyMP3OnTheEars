<template>
  <div class="spotify-footer relative">
    <!-- PROGRESS BAR (AT THE VERY TOP EDGE) -->
    <div class="absolute top-0 left-0 w-full h-[4px] group cursor-pointer z-50">
      <!-- Background track -->
      <div class="w-full h-full bg-gray-700"></div>

      <!-- Progress Fill (Green) -->
      <div
        class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-100 ease-linear"
        :style="{ width: progressPercentage + '%' }"
      ></div>

      <!-- PrimeVue Slider (Invisible but handles interaction) -->
      <Slider
        v-model="currentTime"
        :min="0"
        :max="duration"
        @change="handleSeek"
        class="absolute top-[-6px] left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity custom-top-slider"
      />
    </div>

    <!-- 1. GAUCHE : Infos Track & Like -->
    <div class="flex items-center gap-4 w-1/3">
      <div v-if="playerStore.currentTrack" class="flex items-center gap-3">
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
          <!-- Time info (Optional: show time below artist) -->
          <span class="text-[10px] text-gray-500 font-mono">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>
        </div>

        <button
          @click="
            playlistStore.toggleFavorite({
              ...playerStore.currentTrack,
              duration: String(playerStore.currentTrack.duration)
            })
          "
          class="ml-2 text-gray-400 hover:text-green-500 transition-colors"
          :class="{ 'text-green-500': isLiked }"
        >
          <i :class="isLiked ? 'pi pi-heart-fill' : 'pi pi-heart'" style="font-size: 1rem"></i>
        </button>
      </div>

      <div v-else class="text-gray-500 text-sm italic ml-4">Prêt à jouer 🎵</div>
    </div>

    <!-- 2. CENTRE : Contrôles Dock -->
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
import { usePlaylistStore } from '@stores/usePlaylistStore'
import Dock from 'primevue/dock'
import Slider from 'primevue/slider'

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()
const volume = ref(50)

// --- PROGRESS BAR LOGIC ---
const currentTime = ref(0)
const isDragging = ref(false)

const duration = computed(() => {
  if (!playerStore.currentTrack) return 180 // Default fallback
  // Parse the string "3:59" into seconds
  return parseDuration(playerStore.currentTrack.duration)
})

const progressPercentage = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

// Sync with store time (unless dragging)
watch(
  () => playerStore.currentTime,
  (newVal) => {
    if (!isDragging.value) {
      currentTime.value = newVal
    }
  }
)

function handleSeek(val: number | number[]) {
  // PrimeVue might return event or value
  const seekTime = typeof val === 'number' ? val : currentTime.value
  playerStore.seekTo(seekTime)
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}
// --------------------------

watch(volume, (newVol) => {
  playerStore.setVolume(Number(newVol))
})

const isLiked = computed(() => {
  if (!playerStore.currentTrack) return false
  return playlistStore.favorites.some((t) => t.id === playerStore.currentTrack?.id)
})

const handleSpacebar = (event: KeyboardEvent) => {
  if (event.code === 'Space' && (event.target as HTMLElement).tagName !== 'INPUT') {
    event.preventDefault()
    if (playerStore.isPlaying) playerStore.pause()
    else playerStore.play()
  }
}

onMounted(() => document.addEventListener('keydown', handleSpacebar))
onUnmounted(() => document.removeEventListener('keydown', handleSpacebar))

const controlButtons = ref([
  { label: 'Précédent', icon: 'pi pi-step-backward', command: () => playerStore.playPrevious() },
  {
    label: 'Play/Pause',
    icon: computed(() => (playerStore.isPlaying ? 'pi pi-pause' : 'pi pi-play')),
    command: () => (playerStore.isPlaying ? playerStore.pause() : playerStore.play())
  },
  { label: 'Suivant', icon: 'pi pi-step-forward', command: () => playerStore.playNext() }
])

function parseDuration(durationStr: string | number): number {
  if (typeof durationStr === 'number') return durationStr
  if (!durationStr) return 0

  const parts = durationStr.split(':').map(Number)
  if (parts.length === 2) {
    // MM:SS -> seconds
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3) {
    // HH:MM:SS -> seconds
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}
</script>

<style scoped>
.spotify-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background-color: #1e293b;
  /* Removed border-top since we have the progress bar now */
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  padding: 0 1rem;
}

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

.control-button {
  /* ... same as before ... */
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

.music-controls :deep(.p-dock-list-container) {
  background: none;
  border: none;
  background-color: none;
}

/* Volume Slider */
:deep(.p-slider) {
  background: #475569;
}
:deep(.p-slider-range) {
  background-color: #10b981;
}

/* Custom Top Slider (Invisible by default, handle on hover) */
:deep(.custom-top-slider .p-slider-range) {
  background: transparent;
} /* Use our div for color */
:deep(.custom-top-slider) {
  background: transparent;
  height: 12px;
} /* Bigger hit area */
:deep(.custom-top-slider .p-slider-handle) {
  background: white;
  border: none;
  width: 12px;
  height: 12px;
  margin-top: -6px; /* Center vertically relative to top edge */
}
</style>

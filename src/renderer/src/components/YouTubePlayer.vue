<template>
  <div id="yt-player-container" class="yt-player-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlayerStore } from '@stores/usePlayerStore'

const playerStore = usePlayerStore()
let timeInterval: number | null = null

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
    height: '360',
    width: '640',
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
          // ex: playerStore.playNextTrack();
        }

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
</script>

<style scoped>
.yt-player-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
}
</style>

import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isPlaying: false as boolean,
    volume: 80 as number,
    currentTime: 0 as number,
    currentTrack: null as null | {
      id: string
      title: string
      channel: string
      thumbnail: string
      duration: number
    },
    playerInstance: null as any // référence à l’instance YT.Player
  }),
  actions: {
    setPlayerInstance(instance: any) {
      this.playerInstance = instance
    },
    setCurrentTrack(track: any) {
      this.currentTrack = track
      this.currentTime = 0
    },
    setIsPlaying(value: boolean) {
      this.isPlaying = value
    },
    setCurrentTime(seconds: number) {
      this.currentTime = seconds
    },
    play() {
      if (this.playerInstance) {
        const currentVideoId = this.playerInstance.getVideoData()?.video_id

        // Charger seulement si c'est une nouvelle musique
        if (this.currentTrack?.id && currentVideoId !== this.currentTrack.id) {
          this.playerInstance.loadVideoById(this.currentTrack.id)
        } else {
          // Sinon juste reprendre la lecture
          this.playerInstance.playVideo()
        }
        this.isPlaying = true
      }
    },
    pause() {
      if (this.playerInstance) {
        this.playerInstance.pauseVideo()
        this.isPlaying = false
      }
    },
    setVolume(value: number) {
      this.volume = value
      if (this.playerInstance) {
        this.playerInstance.setVolume(value)
      }
    }
  }
})

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
    playerInstance: null as any,
    queue: [] as any[],
    currentIndex: -1
  }),
  actions: {
    setPlayerInstance(instance: any) {
      this.playerInstance = instance
    },
    setCurrentTrack(track: any) {
      this.queue = [track]
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
    },
    playContext(tracks: any[], startIndex: number = 0) {
      this.queue = tracks
      this.currentIndex = startIndex
      this.currentTrack = tracks[startIndex]
      this.isPlaying = true
      // Le watcher dans YouTubePlayer.vue gérera le chargement via loadVideoById
    },
    playNext() {
      // S'il reste des morceaux après l'actuel
      if (this.currentIndex < this.queue.length - 1) {
        this.currentIndex++
        this.currentTrack = this.queue[this.currentIndex]
        this.isPlaying = true
        // Le watcher détectera le changement de currentTrack et lancera la lecture
      } else {
        // Fin de la playlist : on arrête
        this.isPlaying = false
        if (this.playerInstance) {
          this.playerInstance.pauseVideo()
        }
      }
    },
    playPrevious() {
      // Si on n'est pas au début
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.currentTrack = this.queue[this.currentIndex]
        this.isPlaying = true
        // Le watcher détectera le changement de currentTrack
      } else {
        // Si on est au début, on remet le titre à zéro et on s'assure que ça joue
        if (this.playerInstance) {
          this.playerInstance.seekTo(0)
          this.playerInstance.playVideo()
          this.isPlaying = true
        }
      }
    },
    seekTo(seconds: number) {
      if (this.playerInstance) {
        this.playerInstance.seekTo(seconds, true) // true = allowSeekAhead
        this.currentTime = seconds // Optimistic update
      }
    }
  }
})

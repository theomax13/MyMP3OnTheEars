// src/stores/usePlaylistStore.ts
import { defineStore } from 'pinia'

declare global {
  interface Window {
    api: {
      store: {
        get: (key: string) => Promise<any>
        set: (key: string, value: any) => Promise<void>
      }
    }
  }
}

// Assure-toi que ces interfaces sont exportées
export interface Track {
  id: string
  title: string
  thumbnail: string
  duration: string
  channel: string
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
}

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    favorites: [] as Track[],
    playlists: [] as Playlist[] // Liste des playlists perso
  }),

  actions: {
    async loadPlaylists() {
      // Charge tout au démarrage
      const savedPlaylists = await window.api.store.get('playlists')
      const savedFavorites = await window.api.store.get('favorites')

      if (savedPlaylists) this.playlists = savedPlaylists
      if (savedFavorites) this.favorites = savedFavorites
    },

    // 1. Créer une nouvelle playlist vide
    async createPlaylist(name: string) {
      const newId = crypto.randomUUID() // Génère un ID unique natif
      const newPlaylist: Playlist = {
        id: newId,
        name: name,
        tracks: []
      }

      this.playlists.push(newPlaylist)
      await this.save()
      return newId
    },

    // 2. Ajouter un son à une playlist spécifique
    async addToPlaylist(playlistId: string, track: Track) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        // Vérifie les doublons dans cette playlist
        const exists = playlist.tracks.some((t) => t.id === track.id)
        if (!exists) {
          playlist.tracks.push(track)
          await this.save()
        }
      }
    },

    // 3. Supprimer une playlist
    async deletePlaylist(playlistId: string) {
      this.playlists = this.playlists.filter((p) => p.id !== playlistId)
      await this.save()
    },

    async toggleFavorite(track: Track) {
      const index = this.favorites.findIndex((t) => t.id === track.id)

      if (index === -1) {
        this.favorites.push(track)
      } else {
        this.favorites.splice(index, 1)
      }

      await this.save()
    },

    // Sauvegarde globale
    async save() {
      // On utilise JSON.parse/stringify pour enlever les proxies de Vue avant d'envoyer à Electron
      await window.api.store.set('playlists', JSON.parse(JSON.stringify(this.playlists)))
      await window.api.store.set('favorites', JSON.parse(JSON.stringify(this.favorites)))
    }
  }
})

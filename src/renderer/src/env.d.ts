/// <reference types="vite/client" />
interface Window {
  electron: {
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => void
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
  }
  api: {
    searchYouTube: (query: string) => Promise<any[]>
    getPlaylist: (playlistId: string) => Promise<any>
    store: {
      get: (key: string) => Promise<any>
      set: (key: string, value: any) => Promise<void>
      delete: (key: string) => Promise<void>
    }
  }
}

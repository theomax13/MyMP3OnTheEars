import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}

export interface IElectronAPI {
  searchYouTube: (args: {
    query?: string
    continuation?: any
    type?: string
  }) => Promise<{ items: any[]; continuation: any; error?: string }>
  getPlaylist: (playlistId: string) => Promise<{ items: any[]; error?: string; title?: string }>
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<void>
    delete: (key: string) => Promise<void>
  }
}

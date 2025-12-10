import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    api: IElectronAPI
  }
}

export interface IElectronAPI {
  searchYouTube: (args: {
    query?: string
    continuation?: any
  }) => Promise<{ items: any[]; continuation: any }>
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<void>
    delete: (key: string) => Promise<void>
  }
}

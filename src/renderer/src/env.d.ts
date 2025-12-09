/// <reference types="vite/client" />
interface Window {
  api: {
    searchYouTube: (query: string) => Promise<any[]>
  }
}

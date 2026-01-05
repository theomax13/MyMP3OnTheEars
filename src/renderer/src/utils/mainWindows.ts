
export function minimizeWindow(): void {
  ;(window as any).electron.ipcRenderer.send('window-minimize')
}

export function closeWindow(): void {
  ;(window as any).electron.ipcRenderer.send('window-close')
}

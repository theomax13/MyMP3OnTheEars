import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import ytsr from 'ytsr'
import Store from 'electron-store'

const store = new Store()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true
    }
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = details.responseHeaders || {}

    delete responseHeaders['require-trusted-types-for']
    delete responseHeaders['Require-Trusted-Types-For']

    responseHeaders['Content-Security-Policy'] = [
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https://www.google.com https://static.doubleclick.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://www.youtube.com; img-src 'self' data: https:; media-src 'self' https: blob:; connect-src 'self' https:; trusted-types default vue youtube-widget-api ad goog#html 'allow-duplicates';"
    ]

    callback({
      responseHeaders
    })
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('search-youtube', async (event, query) => {
    try {
      // Récupère les 10 premiers résultats
      const filters1 = await ytsr.getFilters(query)
      const typeFilter = filters1.get('Type')
      if (!typeFilter) return []
      const filter1 = typeFilter.get('Video')
      const options = { limit: 10 }
      if (!filter1 || !filter1.url) return []
      const searchResults = await ytsr(filter1.url, options)

      // On nettoie un peu les données pour le front
      return searchResults.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        thumbnail: item.bestThumbnail?.url,
        duration: item.duration,
        channel: item.author?.name
      }))
    } catch (error) {
      console.error('Search error:', error)
      return []
    }
  })

  ipcMain.handle('store-get', (event, key) => {
    return store.get(key)
  })

  ipcMain.handle('store-set', (event, key, value) => {
    store.set(key, value)
  })

  ipcMain.handle('store-delete', (event, key) => {
    store.delete(key)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

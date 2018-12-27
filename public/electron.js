const electron = require('electron')
const settings = require('./settings')

const { app, BrowserWindow, Menu, nativeImage, Tray } = electron

const path = require('path')
const isDev = require('electron-is-dev')

let tray
let mainWindow

const trayIcon = path.join(__dirname, '/trayicon.png')

function createTray() {
  tray = new Tray(nativeImage.createFromPath(trayIcon).resize({ width: 16, height: 16 }))

  const menuItems = [
    {
      label: 'Quit',
      accelerator: 'Cmd+Q',
      click: () => {
        if (mainWindow) {
          app.quit()
        }
      }
    }
  ]

  const contextMenu = Menu.buildFromTemplate(menuItems)

  tray.setToolTip('Electron app')
  tray.setContextMenu(contextMenu)
}

function createWindow() {
  mainWindow = new BrowserWindow(settings)
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', () => {
  createTray()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

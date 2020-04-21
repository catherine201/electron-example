// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
// const url = require('url')
const uploadUrl = 'https://yrbing.com.cn/'
const url = require('url')

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow

// 检测更新
function updateHandle() {
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }
  const os = require('os')

  autoUpdater.setFeedURL(uploadUrl)
  autoUpdater.on('error', () => {
    sendUpdateMessage(message.error)
    // sendUpdateMessage(error);
  })
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', info => {
    console.log(info)
    mainWindow.webContents.send(
      'updateAvailable',
      '<h3>检测到新版本' + info.version + '，需要升级？</h3>' + info.releaseNotes
    )
    // sendUpdateMessage(message.updateAva);
  })
  autoUpdater.on('update-not-available', info => {
    sendUpdateMessage(message.updateNotAva)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', progressObj => {
    console.log(progressObj)
    const winId = BrowserWindow.getFocusedWindow().id
    const win = BrowserWindow.fromId(winId)
    win.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    console.log(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate)
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments)
      console.log('开始更新')
      // some code here to handle event
      autoUpdater.quitAndInstall()
    })

    mainWindow.webContents.send('isUpdateNow')
  })

  ipcMain.on('isDownload', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}

function createWindow() {
  // 创建浏览器窗口,宽高自定义具体大小
  const { screen } = require('electron')
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      // 网页功能的设置
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      nativeWindowOpen: true,
      webSecurity: false,
      nodeIntegration: true, // 是否完整的支持 node. 默认值为true
      nodeIntegrationInWorker: true, // 是否在Web工作器中启用了Node集成
      preload: path.join(__dirname, './renderer.js')
      // preload: './preload.js' // 在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 此脚本都可以访问所有Node API 脚本路径为文件的绝对路径
    }
  })
  // 程序菜单自定义
  const isMac = process.platform === 'darwin'
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
              }
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    const contents = mainWindow.webContents
    const localShortcut = require('electron-localshortcut')
    // 复制黏贴快捷键
    localShortcut.register(mainWindow, 'CommandOrControl+A', () => {
      contents.selectAll()
    })
    localShortcut.register(mainWindow, 'CommandOrControl+C', () => {
      contents.copy()
    })
    localShortcut.register(mainWindow, 'CommandOrControl+V', () => {
      contents.paste()
    })
  }
  // 加载应用----线上
  // mainWindow.loadURL('https://yrbing.com.cn/')
  // 加载应用----
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // mainWindow.webContents.openDevTools()
  // 关闭window时触发下列事件.
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  ipcMain.on('openDev', () => {
    mainWindow.webContents.openDevTools()
  })
  updateHandle()
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow)

// 所有窗口关闭时退出应用.
app.on('window-all-closed', () => {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow()
  }
})

// 你可以在这个脚本中续写或者使用require引入独立的js文件.

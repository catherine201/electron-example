/* eslint-disable no-unused-vars */

// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
// const os = require('os');
const localShortcut = require('electron-localshortcut');

const uploadUrl = 'https://***/';

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text);
}
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  };

  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', error => {
    sendUpdateMessage(message.error);
  });
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(message.checking);
  });
  autoUpdater.on('update-available', info => {
    sendUpdateMessage(message.updateAva);
  });
  autoUpdater.on('update-not-available', info => {
    console.log(info);
    sendUpdateMessage(message.updateNotAva);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', progressObj => {
    mainWindow.webContents.send('downloadProgress', progressObj);
  });
  autoUpdater.on('update-downloaded', function(
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate
  ) {
    ipcMain.on('isUpdateNow', () => {
      console.log(arguments);
      console.log('开始更新');
      // some code here to handle event
      autoUpdater.quitAndInstall();
    });

    mainWindow.webContents.send('isUpdateNow');
  });

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates();
  });
}

function createWindow() {
  // 创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // backgroundColor: '#000',
    webPreferences: {
      // 网页功能的设置
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      nativeWindowOpen: true,
      webSecurity: false,
      nodeIntegration: true, // 是否完整的支持 node. 默认值为true
      nodeIntegrationInWorker: true, // 是否在Web工作器中启用了Node集成
      preload: path.join(__dirname, './public/renderer.js')
      // preload: './preload.js' // 在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 此脚本都可以访问所有Node API 脚本路径为文件的绝对路径
    }
  });

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    const contents = mainWindow.webContents;
    localShortcut.register(mainWindow, 'CommandOrControl+A', () => {
      contents.selectAll();
    });
    localShortcut.register(mainWindow, 'CommandOrControl+C', () => {
      contents.copy();
    });
    localShortcut.register(mainWindow, 'CommandOrControl+V', () => {
      contents.paste();
    });
  }

  // mainWindow.setBackgroundColor('#000');

  // mainWindow.openDevTools();

  /* 
   * 加载应用-----  electron-quick-start中默认的加载入口
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  */
  // 加载应用----适用于 react 项目
  //   mainWindow.loadURL('http://localhost:3000/');
  // 加载应用----react 打包
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    })
    // 'http://192.168.0.11:8082'
  );

  // 打开开发者工具，默认不打开
  mainWindow.webContents.openDevTools();

  // 关闭window时触发下列事件.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('openDev', () => {
    mainWindow.openDevTools();
  });
  updateHandle();
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow);

// 所有窗口关闭时退出应用.
app.on('window-all-closed', () => {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

// 你可以在这个脚本中续写或者使用require引入独立的js文件.
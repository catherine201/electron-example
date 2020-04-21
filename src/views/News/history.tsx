import React from 'react'
import { isElectron } from '@/utils/index.js'
import { Button } from 'antd'
import os from 'os'
import styles from './index.module.less'

declare global {
  interface Window {
    electron: any
    remote: any
    shell: any
  }
}
const BrowserWindow = window.remote && window.remote.BrowserWindow
const History = () => {
  const showDialog = () => {
    if (!isElectron()) return
    window.remote.dialog.showErrorBox('主进程dialog模块', '使用remote调用的')
    // remote && remote.dialog && remote.dialog.showErrorBox('主进程才有的dialog模块', '我是使用remote调用的')
  }
  const showItemInFolder = () => {
    if (!isElectron()) return
    window.shell.showItemInFolder(os.homedir()) // os.homedir() 当前系统根目录
  }
  const openNewWindow = () => {
    if (!isElectron()) return
    console.log(window.remote.getGlobal('mainId'))
    let win = new BrowserWindow({ width: 800, height: 600 })
    win.on('closed', () => {
      win = null
    })
    // 加载远程URL
    win.loadURL('https://baidu.com')
    // 或加载本地HTML文件
    win.loadURL(`file://${__dirname}/app/index.html`)
  }

  const showOpenDialog = () => {
    if (!isElectron()) return
    window.remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory', 'openFile']
      },
      (data: any) => {
        console.log(`【选择路径：${data && data[0]}】 `)
      }
    )
  }
  return (
    <div className={styles.history_wrap}>
      <h1>History</h1>
      <Button onClick={showDialog} type="primary">
        Dialog show Error Msg
      </Button>
      <hr />
      <Button onClick={showItemInFolder} type="primary">
        打开当前系统根目录
      </Button>
      <hr />
      <Button onClick={openNewWindow} type="primary">
        打开新窗口
      </Button>
      <hr />
      <Button onClick={showOpenDialog} type="primary">
        打开或选择系统目录
      </Button>
      <hr />
    </div>
  )
}
export default History

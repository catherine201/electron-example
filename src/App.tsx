import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import GenerateRoute from '@/components/generateRoute.tsx'
import { notification } from 'antd'
import routeConfig from '@/routes/index.js'
import { Provider } from 'react-redux'
import store from '@/store/index.js'
const ipcRenderer = (window as any).electron && (window as any).electron.ipcRenderer

console.dir(<GenerateRoute config={routeConfig} />)

export class App extends React.Component {
  public componentDidMount() {
    const self = this
    if (ipcRenderer) {
      ipcRenderer.send('checkForUpdate')
      ipcRenderer.on('message', (event: any, message: any) => {
        console.log(event, message)
      })
      // 注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
      ipcRenderer.on('downloadProgress', (event: any, progressObj: any) => {
        console.log('下载', progressObj)
      })
      ipcRenderer.on('isUpdateNow', () => {
        console.log('是否现在更新')
        ipcRenderer.send('isUpdateNow')
      })
      // 检测到新版本
      ipcRenderer.on('updateAvailable', (event: any, message: any) => {
        console.log(event, message)
        notification.open({
          message: 'Notification',
          description: '检测到新版本,正在更新中……',
          onClick: () => {
            console.log('Notification Clicked!')
          }
        })
        ipcRenderer.send('isUpdateNow')
      })
    }
  }
  public componentWillUnmount() {
    if (ipcRenderer) {
      ipcRenderer.removeAll([
        'message',
        'downloadProgress',
        'isUpdateNow',
        'updateAvailable'
      ])
    }
  }
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <GenerateRoute config={routeConfig} />
        </Router>
      </Provider>
    )
  }
}

/// <reference types="react-scripts" />

// declare var window: Window & { electron: any; remote: any; shell: any }
declare global {
  interface Window {
    electron: any
    remote: any
    shell: any
  }
}
declare module '*.module.less' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.js'
declare module '*.tsx'
declare module 'history'
declare module 'react-router'
declare module 'react-loadable'
declare module 'react-router-dom'
declare module 'redux-connect'

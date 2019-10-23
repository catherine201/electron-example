import React from 'react'
import WrappedRoute from './WrapRoute.js'
import { withRouter } from 'react-router-dom'

interface Props {
  history: any
}
const Layout: React.FC<Props> = props => {
  const logOut = () => {
    console.log(props)
    sessionStorage.clear()
    props.history.push('/login')
  }
  return (
    <div>
      <h1>Layout</h1>
      <button onClick={logOut}>退出</button>
    </div>
  )
}
// 需要嵌套路由就使用WrappedRoute 这个高阶组件
export default WrappedRoute(withRouter(Layout))

import React from 'react'
import WrappedRoute from './WrapRoute.js'
import { withRouter } from 'react-router-dom'
import { Button } from 'antd'
import styles from './layout.module.less'
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
    <div className={styles.layout}>
      <h1>Layout</h1>
      <div className={styles.layout_right}>
        <div
          className={styles.me}
          onClick={() => {
            props.history.push('/admin/mine')
          }}
        >
          我
        </div>
        <Button type="primary" onClick={logOut}>
          退出
        </Button>
      </div>
    </div>
  )
}
// 需要嵌套路由就使用WrappedRoute 这个高阶组件
export default WrappedRoute(withRouter(Layout))

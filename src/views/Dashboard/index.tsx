import React from 'react'
import { Button } from 'antd'
// const imgSrc = require('@/assets/images/logo.jpg')
import imgSrc from '@/assets/images/logo.jpg'
import styles from './index.module.less'

const Dashboard = (props: any) => {
  const toAdmin = () => {
    props.history.push('/admin')
  }
  return (
    <div className={styles.home_wrap}>
      <div>
        <img src={imgSrc} alt="logo" className={styles.home_logo} />
      </div>
      <div style={{ margin: '20px 0' }}>
        <h1>Catherine 后台管理系统</h1>
      </div>
      <div>
        <Button
          className={styles.btn_block}
          onClick={() => {
            toAdmin()
          }}
        >
          进入系统...
        </Button>
      </div>
    </div>
  )
}
export default Dashboard

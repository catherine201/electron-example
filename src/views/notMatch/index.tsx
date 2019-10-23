import React from 'react'
import { Button } from 'antd'
import styles from './index.module.less'

const NotMatch = (props: any) => {
  const handlerBack = () => {
    props.history.go(-1)
  }

  return (
    <div className={`fadeInUp ${styles['error-panel']}`}>
      <h1 className={styles['error-code']}>404</h1>
      <p className={styles['error-description']}>Page Not Found</p>
      <div className={styles['error-ctrl']}>
        <Button type="primary" href="/">
          主页
        </Button>
        &nbsp;
        <Button onClick={() => handlerBack()}>返回</Button>
      </div>
      <p className={styles.copyright}>Make by Catherine</p>
    </div>
  )
}
export default NotMatch

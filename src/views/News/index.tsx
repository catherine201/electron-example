import React from 'react'
import { Link } from 'react-router-dom'
import WrappedRoute from '@/components/WrapRoute.js'
import { withRouter } from 'react-router-dom'
import styles from './index.module.less'
const News = (props: any) => {
  console.log(props.location.pathname)
  return (
    <div className={styles.news_wrap}>
      <h1>News</h1>
      <ul className={styles.router_wrap}>
        <li>
          <Link to="/admin/news/history">history</Link>
        </li>
        <li>
          <Link to="/admin/news/star">star</Link>
        </li>
      </ul>
    </div>
  )
}
export default WrappedRoute(withRouter(News))

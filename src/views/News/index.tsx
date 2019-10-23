import React from 'react'
import { Link } from 'react-router-dom'
import WrappedRoute from '@/components/WrapRoute.js'

const News = () => {
  return (
    <div>
      <h1>News</h1>
      <ul>
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
export default WrappedRoute(News)
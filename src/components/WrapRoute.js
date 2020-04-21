import React, { Component } from 'react'
import { RouteWithSubRoutes } from '@/components/generateRoute.tsx'
import { Switch, Route } from 'react-router-dom'
import NotMatch from '@/views/notMatch/index.tsx'
import styles from './layout.module.less'
export default WrappedRoute => {
  class NewComponent extends Component {
    render() {
      console.log(this.props)
      const IsMatch = this.props.location.pathname !== this.props.match.url
      return (
        <div className={styles.root_wrap}>
          <WrappedRoute />
          <Switch>
            {this.props.routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
            {IsMatch && <Route component={NotMatch} />}
          </Switch>
        </div>
      )
    }
  }
  return NewComponent
}

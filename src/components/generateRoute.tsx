import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import NotMatch from '@/views/notMatch/index.tsx'

export const RouteWithSubRoutes = (route: any) => {
  const isLogin = sessionStorage.getItem('isLogin') && JSON.parse(sessionStorage.getItem('isLogin') || 'false')
  const needAuth = route.auth === false ? false : true
  console.log(isLogin, needAuth)
  return needAuth && !isLogin ? (
    <Redirect to={'/login'} />
  ) : (
    <Route
      path={route.path}
      exact={route.exact || false}
      strict={route.strict || false}
      render={(props: any) => <route.component {...props} routes={route.childRoutes} />}
    />
  )
}

const GenerateRoute = (props: any) => {
  return (
    <React.Fragment>
      <Switch>
        {props.config.map((route: any, i: number) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        {<Route component={NotMatch} />}
      </Switch>
    </React.Fragment>
  )
}

export default withRouter(GenerateRoute)

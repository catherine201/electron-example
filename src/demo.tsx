import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import styles from '@/App.module.less'
import createApi from '@/api/registerAndLogin/index.js'
import { getParams } from '@/utils/index.js'
import { loading } from '@/api/axios.js'
const selectOption = async () => {
  const [qianduanzhidian, FrontendMagazine] = await Promise.all([
    createApi.queryListCoins(),
    createApi.queryBankType()
    // createApi.queryCoinOutAddr(),
    // createApi.queryCointxs(),
    // createApi.queryCoinInAddr()
  ])
  console.log(qianduanzhidian, FrontendMagazine)
}

const init = async () => {
  // loading.start()
  // this.props.history.push('/admin/user/0');
  // this.props.history.push('/admin/user/0');
  const authObj = {
    access_token: getParams('token'),
    appid: getParams('id')
  }
  const authResult = await createApi.authLogin(authObj)
  if (authResult) {
    // const userObj = res.data;
    const userObj: any = {}
    const info = {
      authcode: authResult.data.auth_code,
      openID: getParams('openid')
    }
    console.log(info)
    const result = await createApi.secondLogin(info)
    if (result && result.accessToken) {
      // loading.end()
      // this.props.dispatch.menu.getOwnMenu();
      userObj.access_token = getParams('token')
      userObj.openid = getParams('openid')
      userObj.second_access_token = result.accessToken
      userObj._id = result.accountID
      userObj.auth_code = authResult.data.auth_code
      sessionStorage.setItem('user', JSON.stringify(userObj))
      selectOption()
      // this.props.history.push('/admin/user/0')
    } else {
      // this.$msg.error('登陆失败')
      // loading.end()
    }
  } else {
    // loading.end()
  }
}

export const App = () => {
  const [state, setState] = useState({ username: 'scq000' })
  const [myName, setMyName] = useState('catherine')

  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    // loading.start()
    init()
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  useEffect(() => {
    console.log('componentDidUpdate： 更新usernmae')
  }, [myName])

  return (
    <div className={styles.App}>
      <p>Welcome to homepage. {state.username}</p>
      <p>Welcome. {myName}</p>
      <input
        type="text"
        placeholder="input a username"
        onChange={event => setState({ username: event.target.value })}
      />
      <input type="text" placeholder="input a myName" onChange={event => setMyName(event.target.value)} />
      <Button
        type="primary"
        // 既可以传入一个新值，也可以根据旧值进行计算
        onClick={() => {
          setMyName(prev => `${prev}....`)
        }}
      >
        Button
      </Button>
    </div>
  )
}

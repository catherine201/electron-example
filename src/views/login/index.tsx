import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Icon, Checkbox } from 'antd'
import { withRouter } from 'react-router-dom'
import { regular } from '@/utils/validate.js'
import { connect } from 'react-redux'
import styles from './index.module.less'
import imgSrc from '@/assets/images/logo.jpg'

const Login = (props: any) => {
  useEffect(() => {
    console.log('componentDidMount: 组件加载后')
    // loading.start()
    //init()
    return () => {
      console.log('componentWillUnmount: 组件卸载， 做一些清理工作')
    }
  }, [])

  useEffect(() => {
    console.log('componentDidUpdate： 更新usernmae')
  }, [])

  const validateToPassword = (rule: any, value: any, callback: any) => {
    if (value && !regular.passWord.test(value)) {
      callback('密码至少为8位的字母,数字,字符任意两种的组合!')
    } else {
      callback()
    }
  }

  const handleLogin = () => {
    sessionStorage.setItem('isLogin', JSON.stringify(true))
    console.log(props)
    props.history.push('/admin')
  }
  const { getFieldDecorator } = props.form
  return (
    <div className={styles.login_wrap}>
      <div className="text-center">
        <img src={imgSrc} width="100" height="100" alt="logo" className={styles.logo} />
      </div>
      <Form onSubmit={handleLogin}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }]
          })(
            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码!' },
              {
                validator: validateToPassword
              }
            ]
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <Button className="btn-block btn-lg" type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
      <h1 className="text-center" style={{ color: '#1890FF', fontSize: '12px' }}>
        Catherine Platform
      </h1>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  test: state.demo.test
})

const mapDispatchToProps = (dispatch: any) => ({
  getTest: dispatch.demo.getTest
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form.create()(Login))
)

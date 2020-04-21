import createApi from '../createApi'
import { serverIp } from '../server_config'

const config = {
  authLogin: {
    url: '/api/tokens/auth_code',
    options: {
      method: 'GET',
      baseUrl: serverIp.login
      // showLoading: false
    }
  },
  // 最终登录
  secondLogin: {
    url: '/account/login',
    options: {
      method: 'POST',
      errorHandler: true
      // contentType: 'json'
      // showLoading: false
    }
  }
}

export default createApi(config)

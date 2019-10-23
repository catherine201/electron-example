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
  },
  // 获取支持的币种
  queryListCoins: {
    url: '/configure/support/coins',
    method: 'get',
    options: {
      errorHandler: true
    }
  },
  // 获取支持的银行
  queryBankType: {
    url: '/configure/support/banks',
    method: 'get',
    options: {
      errorHandler: true,
      showLoading: false
    }
  },
  // 提现地址
  queryCoinOutAddr: {
    url: '/admin/bankcards',
    method: 'get',
    options: {
      errorHandler: true
    }
  },
  // 充币记录 提币记录
  queryCointxs: {
    url: '/admin/cointxs',
    method: 'get',
    options: {
      errorHandler: true
    }
  },
  // 充币地址
  queryCoinInAddr: {
    url: '/admin/recharge/addresses',
    method: 'get',
    options: {
      errorHandler: true
    }
  }
}

export default createApi(config)

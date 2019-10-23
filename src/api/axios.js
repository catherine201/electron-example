import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'
import { serverIp } from './server_config'
import loadingImg from '../assets/images/loading.gif'
// import store from '../store/index'

axios.defaults.baseURL = serverIp.logic
axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
// 请求前统一添加token
// axios.defaults.headers.common.authorization = getToken();
let count = 0
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // count 这里是为了解决loading问题
    count++
    const originArr =
      (sessionStorage.getItem('loaddingCount') && JSON.parse(sessionStorage.getItem('loaddingCount'))) || []
    console.log(originArr)
    originArr.push(count)
    sessionStorage.setItem('loaddingCount', JSON.stringify(originArr))
    config.headers.num = count
    if (config.method === 'get') {
      // 加个随机数解决有些ie 浏览器卡死的问题
      // config.url = `${config.url}?${Math.random()}`;
    }
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  res => {
    console.log(res)
    const num = JSON.parse(JSON.stringify(res)).config.headers.num
    const originArr =
      (sessionStorage.getItem('loaddingCount') && JSON.parse(sessionStorage.getItem('loaddingCount'))) || []
    // originArr.push(count)
    originArr.splice(originArr.indexOf(num), 1)
    sessionStorage.setItem('loaddingCount', JSON.stringify(originArr))
    return Promise.resolve(res)
  },
  error => {
    console.log(error)
    let errorMsg = ''
    const num = JSON.parse(JSON.stringify(error)).config.headers.num
    const originArr =
      (sessionStorage.getItem('loaddingCount') && JSON.parse(sessionStorage.getItem('loaddingCount'))) || []
    originArr.splice(originArr.indexOf(num), 1)
    sessionStorage.setItem('loaddingCount', JSON.stringify(originArr))
    // Promise.reject(error);
    if (error.response) {
      const responseCode = error.response.status
      console.log(responseCode)
      console.log(error.response)
      switch (responseCode) {
        // 401：未登录
        case 401:
          // 跳转登录页
          errorMsg = 'token已过期'
          window.sessionStorage.clear()
          window.location.href = '/#/login'
          break
        case 502:
          errorMsg = '502网关错误'
          break
        case 504:
          errorMsg = '504网关超时'
          break
        // 其他错误，直接抛出错误提示
        default:
          errorMsg = error.response.data.message || error.response.data
          break
      }
    } else if (!error.response) {
      // 请求超时状态
      if (error.message.includes('timeout')) {
        console.log('超时了')
        errorMsg = '请求超时，请检查网络是否连接正常'
      } else {
        // 可以展示断网组件
        console.log('断网了')
        errorMsg = '请求失败，请检查网络是否已连接'
      }
      return
    }
    console.log(errorMsg)
    errorMsg && message.error(errorMsg)
    return Promise.reject(error)
  }
)

function createDom() {
  const containerDOM = document.createElement('div')
  containerDOM.setAttribute('id', 'loadingContainer')
  containerDOM.style.cssText = `width: 100%;height: 100%;position: fixed;display: block;background: #e0e0e0;bottom: 0;text-align: center;opacity: 0.5;z-index: 5000`
  const ImgDOM = document.createElement('img')
  ImgDOM.style.cssText = `display: inline-block;width: 2rem; height: 2rem;position: absolute;top: 50%; left: 50%; margin-top: -1rem; margin-left: -1rem;`
  ImgDOM.setAttribute('src', loadingImg)
  containerDOM.appendChild(ImgDOM)
  document.body.appendChild(containerDOM)
}
function getToken() {
  console.log(sessionStorage.getItem('user'))
  return sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).second_access_token : ''
}

// let loadingNum = 0;
// 遮罩层
export const loading = {
  start: () => {
    const containerDOM = document.getElementById('loadingContainer')
    if (!containerDOM) {
      createDom()
    } else {
      containerDOM.style.display = 'block'
    }
  },
  end: () => {
    setTimeout(() => {
      const containerDOM = document.getElementById('loadingContainer')
      if (containerDOM) {
        containerDOM.style.display = 'none'
      }
    }, 1000)
  }
}
export function fetchApi(url, options, data) {
  if (typeof options.showLoading !== 'boolean') {
    options.showLoading = true
  }
  if (options.showLoading) {
    loading.start()
  }
  if (typeof options.errorHandler !== 'boolean') {
    options.errorHandler = true
  }
  const baseURL = options.baseUrl || serverIp.logic
  // || serverIp.base
  const urlArr = url.split('%')
  if (urlArr.length > 1) {
    const urlRes = urlArr.map((item, index) => {
      const dataCopy = JSON.parse(JSON.stringify(data))
      Object.keys(data).forEach(it => {
        if (it === item) {
          delete data[item]
        }
      })
      console.log(item)
      return index % 2 === 0 ? item : (item = dataCopy[item] || '')
    })
    url = urlRes.join('')
  }
  // console.log(url)
  const method = options.method || 'GET'
  const headers = {
    'Content-Type': options.contentType !== 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
    'X-Session-Mode': 'header',
    'X-Session-Id': sessionStorage.getItem('X-Session-Id') || null
    // Authorization: getToken()
  }
  const params = data
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    data = qs.stringify(data)
  }
  // let params = qs.stringify(data)
  const ajaxObj = {
    baseURL,
    url,
    method,
    headers,
    timeout: 60000,
    data,
    params
  }
  if (method === 'GET' || method === 'DELETE') {
    ajaxObj.data = null
  } else if (method === 'POST') {
    ajaxObj.params = null
  }
  return new Promise((resolve, reject) => {
    axios(ajaxObj)
      .then(
        response => {
          console.dir(response)
          if (response) {
            return resolve(response.data)
          }
        },
        error => {
          console.dir(error)
        }
      )
      .catch(error => {
        if (options.errorHandler) {
          if (options.showLoading) {
            // loadingNum--;
            const originArr =
              (sessionStorage.getItem('loaddingCount') && JSON.parse(sessionStorage.getItem('loaddingCount'))) || []
            if (!originArr.length) {
              // console.log(errorMsg);
              loading.end()
              return
            }
          }
        }
        reject(error)
      })
      .then(() => {
        if (options.showLoading) {
          // loadingNum--;
          const originArr =
            (sessionStorage.getItem('loaddingCount') && JSON.parse(sessionStorage.getItem('loaddingCount'))) || []
          if (!originArr.length) {
            loading.end()
          }
        }
      })
  })
}

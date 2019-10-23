import createApi from '../createApi'
import { serverIp } from '../server_config'

const config = {
  // test
  test: {
    // test
    url: '/game/%pageNum%/menu',
    options: {
      method: 'GET',
      contentType: 'json',
      errorHandler: false,
      showLoading: false,
      baseUrl: serverIp.login
    }
  }
}

export default createApi(config)

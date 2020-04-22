import axios from 'axios'

// nprogess
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return config
  },
  error => {
    return console.log(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  config => {
    NProgress.done()
    return config
  },
  error => {
    return console.log(error)
  }
)

export default axios

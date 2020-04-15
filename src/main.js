import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// element-ui
import './plugins/element-ui.js'

// 阿里图标
import './assets/fonts/iconfont.css'

// 全局样式
import './assets/css/global.css'

// 树状表格
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('ZkTable', ZkTable)

// 富文本编辑器
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component('quillEditor', quillEditor)

// this.$axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  error => {
    return console.log(error)
  }
)
Vue.prototype.$axios = axios

// 全局过滤器
import moment from 'moment'
Vue.filter('dateFilter', (dateMsg, filterModel = 'YYYY-MM-DD') => {
  return moment(dateMsg).format(filterModel)
})

// 消息提示的环境配置，设置为开发环境或者生产环境
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

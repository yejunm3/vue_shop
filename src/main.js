import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// element-ui
import './plugins/element-ui.js'

// icon-font
import './assets/fonts/iconfont.css'

// 全局样式
import './assets/css/global.css'

// this.$axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios

// 消息提示的环境配置，设置为开发环境或者生产环境
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

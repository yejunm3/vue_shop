import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 消息提示的环境配置，设置为开发环境或者生产环境
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

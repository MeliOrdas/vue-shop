import Vue from 'vue';
import App from './App.vue';
// 路由
import router from './router';
// element ui
import './plugins/element.js';
// 全局样式表
import 'assets/css/global.css';
// Axios
import Axios from 'axios';
// 配置请求根路径
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = Axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

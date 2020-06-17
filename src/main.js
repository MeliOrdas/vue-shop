import Vue from 'vue';
import App from './App.vue';
// 路由
import router from './router';

// element ui
import './plugins/element.js';

// 导入字体图标
import './assets/font_alh70fkaxsa/iconfont.css';

// 全局样式表
import 'assets/css/global.css';
// Axios
import Axios from 'axios';
// 解决 vue  鼠标事件控制台警告
import 'default-passive-events';
// 配置请求根路径
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

Vue.prototype.$http = Axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

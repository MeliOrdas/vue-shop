import Vue from 'vue';
import App from './App.vue';
// 路由
import router from './router';

// 富文本皮肤导入
import 'quill/dist/quill.snow.css';
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
import TreeTable from 'vue-table-with-tree-grid';

// 将富文本编辑器注册全局
import VueQuillEditor from 'vue-quill-editor';
// 配置请求根路径
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.component('tree-table', TreeTable);
// 将富文本编辑器注册全局
Vue.use(VueQuillEditor);

Vue.filter('dateFormat', function (origin) {
  const dt = new Date(origin);
  // 获取时间年份 为数字
  const y = dt.getFullYear();
  // 获取月份 为数字
  const m = (dt.getMonth() + 1 + '').padStart(2, 0);
  // 获取 日
  const d = (dt.getDate());

  // 获取 时
  const hh = (dt.getHours());
  // 获取 分
  const mm = (dt.getMinutes());
  // 获取 秒
  const ss = (dt.getSeconds());

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

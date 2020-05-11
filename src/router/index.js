import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from 'components/Login.vue';
import Home from 'components/Home.vue';

Vue.use(VueRouter);
// 路由
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/Home', component: Home }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});
router.beforeEach((to, from, next) => {
  /**
   * to 将要访问的路径
   * from 来自那个路径
   * next()  放行
   */
  if (to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
});

export default router;

import Vue from 'vue';
import { Button, Form, FormItem, Input, Message, Container, Aside, Main, Header, Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui';

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Header);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// 挂载消息弹窗
Vue.prototype.$message = Message;

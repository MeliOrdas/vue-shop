import Vue from 'vue';
import { Button, Form, FormItem, Input, Message } from 'element-ui';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// 挂载消息弹窗
Vue.prototype.$message = Message;

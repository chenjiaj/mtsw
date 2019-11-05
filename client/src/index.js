/**
 * Created by chenjiajun on 2019/11/4.
 */
import Vue from 'vue';
import {
  Upload,
  Table,
  Button,
  TableColumn
} from 'element-ui';
import router from './view/router';
import app from './view/app.vue'
import 'element-ui/lib/theme-chalk/index.css';
import axios from './utils/axios';

Vue.prototype.$axios = axios;

Vue.use(Upload);
Vue.use(Table);
Vue.use(Button);
Vue.use(TableColumn);

new Vue({
  el: '#app',
  router,
  render: h => h(app)
});

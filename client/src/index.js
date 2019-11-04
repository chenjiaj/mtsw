/**
 * Created by chenjiajun on 2019/11/4.
 */
import Vue from 'vue';
import {
  Upload
} from 'element-ui';
import router from './view/router';
import app from './view/app.vue'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Upload);

new Vue({
  el: '#app',
  router,
  render: h => h(app)
});

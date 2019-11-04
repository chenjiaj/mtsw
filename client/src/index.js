/**
 * Created by chenjiajun on 2019/11/4.
 */
import Vue from 'vue';
import router from './view/router';
import app from './view/app.vue'

new Vue({
  el:'#app',
  router,
  render: h => h(app)
});

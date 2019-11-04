/**
 * Created by chenjiajun on 2019/11/4.
 */
import Vue from 'vue'
import Router from 'vue-router';
import IndexRouter from './index/router'

const routes = [
  ...IndexRouter
];

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes
});

export default router;

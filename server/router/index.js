/**
 * Created by chenjiajun on 2019/11/4.
 */
const Router = require('koa-router');
const router = new Router();
router.get('/test', ctx => {
  ctx.body = 'hello'
});

module.exports = router;


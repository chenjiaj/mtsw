/**
 * Created by chenjiajun on 2019/11/6.
 */

const isLogin = (ctx, next) => {
  const uid = ctx.request.body.uid;
  if (!uid) {
    ctx.body = {
      code: -1,
      message: '用户信息错误'
    };
    return;
  }

  next();
};

module.exports = isLogin;

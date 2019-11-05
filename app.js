/**
 * Created by chenjiajun on 2019/11/4.
 */
const Koa = require('koa');
const KoaBody = require('koa-body');
const staticCache = require('koa-static-cache');
const path = require('path');
const app = new Koa();
const router = require('./server/router');
const config = require('./config/index');
const history = require('./middleware/koa2-connect-history-api-fallback');

app.use(history({
  verbose: true
}));

console.log(app.env);

if (app.env === 'development') {
  let webpackDevConfig = require('./build/webpack.dev.config');
  let hotMiddleware = require('koa-webpack-middleware').hotMiddleware;
  let devMiddleware = require('koa-webpack-middleware').devMiddleware;
  let webpack = require('webpack');
  let compiler = webpack(webpackDevConfig);

  app.use(devMiddleware(compiler, {
    watchOptions: {
      // aggregateTimeout: 300,
      // poll: true
    },
    publicPath: '/',
    stats: {
      colors: true,
      chunks: false
    }
  }));
  app.use(hotMiddleware(compiler));
} else {
  app.use(staticCache(path.join(__dirname, '/dist')));
}

app.use(staticCache(path.join(__dirname, '/download')));

app.use(KoaBody({
  multipart: true
}));

app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.method} ${ctx.url} ${ctx.response.get('X-Response-Time')}`);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port);
console.log(`server listen to: http://localhost:${config.port}`);

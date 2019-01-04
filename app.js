const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logUtil = require("./config/log");
const router = require('./routes');
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
// logger
app.use(async (ctx, next) => {
  const start = new Date(); // 响应开始时间
  var ms; // 响应间隔时间
  try {
    await next(); // 开始进入到下一个中间件
    ms = new Date() - start;
    logUtil.logResponse(ctx, ms); // 记录响应日志
  } catch (error) {
    ms = new Date() - start;
    logUtil.logError(ctx, error, ms); // 记录异常日志
  }
});
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
router(app);
module.exports = app

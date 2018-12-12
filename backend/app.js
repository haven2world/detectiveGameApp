'use strict';


/**
 * 入口文件
 */

const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const path = require('path');

//设置config
global._Config = {};

if(process.env.NODE_ENV === 'development'){
  global._Config  = require('./config/config.dev');
}

//全局部分变量
global._Exceptions = require('./src/utils/exceptionUtils');

const errorHandler = require('./src/utils/errorHandler');
const mongoUtils = require('./src/utils/mongoUtils');
const router = require('./src/controller/index');

//初始化 mongodb
mongoUtils.init();

//body解析器
app.use(bodyParser({
  onerror:function (err, ctx) {
    console.error(err);
  }
}));

//错误处理
app.on('error',errorHandler);
app.use(errorHandler.apiMiddleWare);

//设置静态文件目录
const staticPath = './static';
app.use(koaStatic(
  path.join(__dirname, staticPath)
))
//获取路径 /detective/assets/

//设置路由
app.use(router.routes())
  .use(router.allowedMethods({throw:true}))

/*app.use( async (ctx ) => {
  const url = ctx.url
  const query = ctx.query
  const querystring = ctx.querystring

  ctx.body = {
    code:0,
    message:'success',
    data:{
      url,
      query,
      querystring
    }
  }
})*/


app.listen(1019);
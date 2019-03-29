'use strict';


/**
 * router index
 */

const Router = require('koa-router');
const initGlobalInterceptor = require('./globalInterceptor');

//引入 public api controller
const userPublic = require('./userPublicController');

//引入 auth api controller
const user = require('./userController');
const document = require('./documentController');
const skill = require('./skillController');
const manager = require('./gameManagerController')

const router = new Router({prefix:global._Config.baseUrl});
initGlobalInterceptor(router);//引入全局拦截器

//创建路由
router.use('/apis/pub/users', userPublic.routes(), userPublic.allowedMethods());
router.use('/apis/auth/users', user.routes(), user.allowedMethods());
router.use('/apis/auth/documents', document.routes(), document.allowedMethods());
router.use('/apis/auth/skills', skill.routes(), skill.allowedMethods());
router.use('/apis/auth/managers', manager.routes(), manager.allowedMethods());


//测试样例
router.get('/test/:tId',async(ctx,next)=>{
  console.log(ctx.params.tId)
  await next()
})



module.exports = router;

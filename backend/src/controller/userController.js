'use strict';


/**
 * 用户相关接口，登录、获取个人信息
 */

const Router = require('koa-router');

let router = new Router();

//注册账户
router.post('/accounts',async(ctx, next)=>{
  console.log(ctx.request.body)
  await next();
})

module.exports = router;



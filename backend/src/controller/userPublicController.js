'use strict';


/**
 * 用户相关公开接口
 */

const Router = require('koa-router');
let router = new Router();

const userAccountService = require('../service/userAccount');

//注册账户
router.post('/accounts',async(ctx, next)=>{
  const {loginId, password} = ctx.request.body;
  await userAccountService.createUser(loginId, password);
  await next();
})

module.exports = router;


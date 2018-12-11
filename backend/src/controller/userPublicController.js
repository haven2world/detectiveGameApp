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
  let user = await userAccountService.createUser(loginId, password);
  ctx._data.token = user.token;
  await next();
})

//登录
router.post('/signIn',async(ctx, next)=>{
  const {loginId, password} = ctx.request.body;
  if(!loginId || !password){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无效的账户或密码'
    })
  }
  let user = await userAccountService.signIn(loginId, password);
  ctx._data.token = user.token;
  await next();
})

module.exports = router;


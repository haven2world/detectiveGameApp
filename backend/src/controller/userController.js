'use strict';


/**
 * 用户相关接口，登录、获取个人信息
 */

const Router = require('koa-router');

let router = new Router();

//校验token是否有效
router.get('/verify-token',async(ctx, next)=>{
  ctx._data.loginId = ctx._userLoginId;
})

module.exports = router;



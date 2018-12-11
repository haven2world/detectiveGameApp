'use strict';


/**
 * 全局拦截器
 */
const tokenService = require('../service/token');


module.exports = function (router) {
  router.use('/',async(ctx,next)=>{
    ctx.body = {
      code:0,
      message:'success',
      data:{
      }
    };

    ctx._data = ctx.body.data;

    await next();
  });
  router.use('/apis/auth',async(ctx, next)=>{
    const {token} = ctx.header;

    if(!token){
      ctx.throw({
        code:global._Exceptions.TOKEN_ERROR,
        message:'当前用户未登录，请前往登录'
      });
    }

    let payload = await tokenService.verify(token);
    ctx._userLoginId = payload.loginId;

    await next();
  })
}
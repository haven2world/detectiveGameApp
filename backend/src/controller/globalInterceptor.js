'use strict';


/**
 * 全局拦截器
 */
const errorHandler = require('../utils/errorHandler');

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
  })
}
'use strict';


/**
 * 全局拦截器
 */
const errorHandler = require('../utils/errorHandler');

module.exports = function (router) {
  router.use('/',async(ctx,next)=>{
    await next();
  })
}
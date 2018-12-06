'use strict';


/**
 * 错误处理
 */
let errorHandle = (err, ctx)=>{
  console.error(err);
}

errorHandle.apiMiddleWare = async (ctx, next)=>{
  try{
    await next();
  }catch (e) {
    if(!e.code){
      e.code = global._Exceptions.UNKNOWN_ERROR
    }
    if(!e.message){
      e.message = 'Internal Server Error';
    }
    ctx.body = {
      code:e.code,
      message:e.message,
      data:{}
    }
    ctx.app.emit('error', e, ctx)
  }
}

module.exports = errorHandle;
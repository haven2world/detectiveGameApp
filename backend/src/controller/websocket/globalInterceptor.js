'use strict';


/**
 * 全局拦截器
 */
const tokenService = require('../../service/token');


module.exports = async function (ctx) {
  const url = ctx.request.url;
  const ws = ctx.websocket;

  ws.sendJSON = function (data) {
    console.log('ws send:', data);
    return this.send(JSON.stringify(data));
  };

  ws.sendType = function (data, type){
    return this.sendJSON({
      code:0,
      data,
      type,
    });
  };

  ws.respond = function (data, uuid, error) {
    if(error){
      this.sendJSON({
        code: error.code,
        message: error.message,
        uuid,
      });
    }else{
      this.sendJSON({
        code:0,
        data,
        uuid,
      });
    }
  };

  if(url.indexOf('/ws/auth')>=0){
    let checkToken = async (token)=>{
      if(!token){
        ws.sendJSON({
          code:global._Exceptions.TOKEN_ERROR,
        });
        ws.close();
        return;
      }

      let payload;
      try{
        payload = await tokenService.verify(token);
        ctx._userLoginId = payload.loginId;
        ctx._userId = payload.userId;
      }catch(e){
        if(e.code === global._Exceptions.TOKEN_ERROR){
          ws.sendJSON({
            code:global._Exceptions.TOKEN_ERROR,
          });
          ws.close();
        }
      }
    };
    await checkToken(ctx.cookies.get('token'));

    ws.on('message',async (message)=>{
      message = JSON.parse(message);
      const {token} = message;
      await checkToken(token);
    });
  }

}
'use strict';


/**
 * 全局拦截器
 */
const tokenService = require('../../service/token');


module.exports = async function (ctx) {
  const url = ctx.request.url;
  const ws = ctx.websocket;

  ws.sendJSON = function (data) {
    return this.send(JSON.stringify(data));
  };

  ws.respond = function (data, uuid) {
    this.send(JSON.stringify({
      code:0,
      data:data,
      uuid,
    }));
  };

  if(url.indexOf('/ws/auth')>=0){
    ws.on('message',async (message)=>{
      message = JSON.parse(message);
      const {token} = message;

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
    });
  }

}
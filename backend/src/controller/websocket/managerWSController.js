'use strict';


/**
 * 游戏房主websocket 相关接口
 */

const documentService = require('../../service/gameDocument');

//连接池
const ctxs = {};//ctxs - userid

//初始化ws
module.exports = async function (ctx) {
  const ws = ctx.websocket;
  const userId = ctx._userId;

  ctxs[userId] = ctx;

  ws.on('message',async function (message) {
    message = JSON.parse(message);
    const {data, data:{type}} = message;
    if(receiver[type]){
      await receiver[type](data);
    }else{
      ws.sendJSON({
        code:global._Exceptions.NOT_FOUND_ERROR,
      });
    }
  })

};

//接收消息
const receiver = {
  TEST:async function(){
    await sender.TEST();
  }
};

//发送消息
const sender = {
  TEST:async function(){

  }
};
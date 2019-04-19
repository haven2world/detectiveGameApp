'use strict';


/**
 * 游戏websocket 相关接口
 */

const documentService = require('../../service/gameDocument');
const gameService = require('../../service/game');
const playerActions = require('../../constant/playerActions');

//连接池
const ctxs = {};//ctxs - userid

//初始化ws
module.exports = async function (ctx) {
  const ws = ctx.websocket;
  const userId = ctx._userId;

  ctxs[userId] = ctx;

  ws.on('message',async function (message) {
    try{
      message = JSON.parse(message);
      const {data:{type}} = message;
      if(receiver[type]){
        await receiver[type](ctx, message);
      }else{
        ws.sendJSON({
          code:global._Exceptions.NOT_FOUND_ERROR,
        });
      }
    }catch (e) {
      console.error(e);
      ws.sendJSON({
        code:global._Exceptions.UNKNOWN_ERROR,
        message:'服务器开小差了'
      });
    }
  })

};

//接收消息
const receiver = {
  [playerActions.INIT_GAME]:async function(ctx, message){
    const {websocket:ws, _userId:userId} = ctx;
    const {data, uuid} = message;
    const game = await gameService.findPlayingGameAndCompleteDocument(userId);

    //保存游戏相关属性
    ctx.gameId = game._id;
    let role = game.roles.find(item=>item.player.toString()===userId.toString());
    ctx.roleId = role._id;

    let gameData = await gameService.generatePlayerData(game, userId);

    ws.respond({game:gameData}, uuid);
  },
};

//发送消息
const sender = {
  [playerActions.INIT_GAME]:async function(ctx, game){

  }
};
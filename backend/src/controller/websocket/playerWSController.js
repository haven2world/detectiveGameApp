'use strict';


/**
 * 游戏websocket 相关接口
 */

const documentService = require('../../service/gameDocument');
const gameService = require('../../service/game');
const playerActions = require('../../constant/playerActions');
const managerActions = require('../../constant/managerActions');

//连接池
const ctxs = {};// userId : ctx
const userGameRoleMap = {};// gameId : roleId : userId

//初始化ws
async function playWSController(ctx) {
  const ws = ctx.websocket;
  const userId = ctx._userId;

  ctxs[userId.toString()] = ctx;

  ws.on('message',async function (message) {
    try{
      message = JSON.parse(message);
      const {data:{type}} = message;
      if(playWSController.receiver[type]){
        await playWSController.receiver[type](ctx, message);
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

}
//获取游戏参数
async function getGameProps(ctx, refreshFlag, gameIdInProps) {
  const {websocket:ws, _userId:userId} = ctx;

  if(refreshFlag || !ctx.gameId || !ctx.roleId){
    let game;
    if(!gameIdInProps){
      game = await gameService.findPlayingGame(userId).game;
    }else{
      game = await gameService.getGameWithDocument(gameIdInProps, false);
    }
    //保存游戏相关属性
    ctx.gameId = game._id;
    let role = game.roles.find(item=>item.player.toString()===userId.toString());
    ctx.roleId = role._id;

    if(!userGameRoleMap[ctx.gameId.toString()]){
      userGameRoleMap[ctx.gameId.toString()] = {};
    }
    userGameRoleMap[ctx.gameId.toString()][ctx.roleId.toString()] = userId;

    return {gameId: game._id, roleId: role._id}
  }else{
    return {gameId: ctx.gameId, roleId: ctx.roleId}
  }
}

//接收消息
playWSController.receiver = {
  [playerActions.INIT_GAME]:async function(ctx, message){
    const {websocket:ws, _userId:userId} = ctx;
    const {data, uuid} = message;
    let gameIdInProps = null;
    if(data && data.gameId){
      gameIdInProps = data.gameId;
    }
    let {gameId, roleId} = await getGameProps(ctx, true, gameIdInProps);

    const game = await gameService.getGameWithDocument(gameId, true);

    let gameData = await gameService.generatePlayerData(game, userId);

    ws.respond({game:gameData}, uuid);
  },
  [playerActions.COMB_SCENE]:async function(ctx, message){
    const {websocket:ws, _userId:userId,} = ctx;
    const {data:{sceneId}, uuid} = message;
    const {gameId, roleId} = await getGameProps(ctx);

    try {
      await gameService.checkStatusPlaying(gameId);
      let {skillUse, clueInstance, gameInstance} = await gameService.combSomewhere(gameId, sceneId, roleId);
      ws.respond({skillUse, clueInstance}, uuid);
      playWSController.sender[playerActions.COMB_EFFECT](ctx, gameInstance, clueInstance );
    }catch (e) {
      if(!e.code){e.code = global._Exceptions.UNKNOWN_ERROR}
      console.error(e);
      ws.respond(null, uuid, e);
    }
  },
  [playerActions.SHARE_CLUE]:async function(ctx, message){
    const {websocket:ws, _userId:userId,} = ctx;
    const {data:{gameClueId}, uuid} = message;
    const {gameId, roleId} = await getGameProps(ctx);

    try {
      await gameService.checkStatusPlaying(gameId);
      let gameInstance = await gameService.shareClue(gameId, roleId, gameClueId);
      ws.respond({gameClueId}, uuid);
      playWSController.sender[playerActions.SHARE_EFFECT](ctx, gameInstance );
    }catch (e) {
      if(!e.code){e.code = global._Exceptions.UNKNOWN_ERROR}
      console.error(e);
      ws.respond(null, uuid, e);
    }
  },
};

//发送消息
playWSController.sender = {
  [playerActions.COMB_EFFECT]:async function(ctx, gameInstance, clueInstance){
    const scenesObject = await gameService.calculateCombEffect(gameInstance, clueInstance);
    gameInstance.players.forEach(player=>{
      if(ctxs[player._id.toString()]){
        try{
          ctxs[player._id.toString()].websocket.sendType({scenes: scenesObject}, playerActions.COMB_EFFECT);
        }catch (e) {
          console.error(e);
        }
      }
    });
  },
  [playerActions.SHARE_EFFECT]:async function(ctx, gameInstance){
    for(let player of gameInstance.players){
      if(ctxs[player._id.toString()] && player._id.toString()!==ctx._userId.toString()){
        try{
          const {scenes, sharedClues} = await gameService.calculateShareEffect(gameInstance, player._id.toString());
          ctxs[player._id.toString()].websocket.sendType({scenes, sharedClues}, playerActions.SHARE_EFFECT);
        }catch (e) {
          console.error(e);
        }
      }
    }
  },
  [managerActions.REMOVE_PLAYER]:async function(gameId, roleId, playerId){
    if(ctxs[playerId.toString()]){
      const props = await getGameProps(ctxs[playerId.toString()]);
      if(props.roleId.toString()===roleId.toString()
        && props.gameId.toString()===gameId.toString()){
        try{
          ctxs[playerId.toString()].websocket.sendType({gameId, roleId}, managerActions.REMOVE_PLAYER);
        }catch (e) {
          console.error(e);
        }
      }
    }
  },
  [managerActions.ENSURE_TASK]:async function(gameId, roleId, taskId){
    let userId;
    if(userGameRoleMap[gameId.toString()] && userGameRoleMap[gameId.toString()][roleId.toString()]){
      userId = userGameRoleMap[gameId.toString()][roleId.toString()];
    }else{
      return;
    }
    if(ctxs[userId.toString()]){
      const props = await getGameProps(ctxs[userId.toString()]);
      if(props.roleId.toString()===roleId.toString()
        && props.gameId.toString()===gameId.toString()){
        try{
          ctxs[userId.toString()].websocket.sendType({gameId, roleId, taskId}, managerActions.ENSURE_TASK);
        }catch (e) {
          console.error(e);
        }
      }
    }
  },
  [managerActions.CANCEL_TASK]:async function(gameId, roleId, taskId){
    let userId;
    if(userGameRoleMap[gameId.toString()] && userGameRoleMap[gameId.toString()][roleId.toString()]){
      userId = userGameRoleMap[gameId.toString()][roleId.toString()];
    }else{
      return;
    }
    if(ctxs[userId.toString()]){
      const props = await getGameProps(ctxs[userId.toString()]);
      if(props.roleId.toString()===roleId.toString()
        && props.gameId.toString()===gameId.toString()){
        try{
          ctxs[userId.toString()].websocket.sendType({gameId, roleId, taskId}, managerActions.CANCEL_TASK);
        }catch (e) {
          console.error(e);
        }
      }
    }
  },
  [managerActions.ADJUST_DIFFICULTY]:async function(gameId, difficultyLevel){
    let userIds;
    if(userGameRoleMap[gameId.toString()]){
      userIds = Object.keys(userGameRoleMap[gameId.toString()]).map(roleId=>userGameRoleMap[gameId.toString()][roleId.toString()]);
    }else{
      return;
    }
    for(let userId of userIds){
      if(ctxs[userId.toString()]){
        const props = await getGameProps(ctxs[userId.toString()]);
        if(props.gameId.toString()===gameId.toString()){
          try{
            ctxs[userId.toString()].websocket.sendType({gameId, difficultyLevel}, managerActions.ADJUST_DIFFICULTY);
          }catch (e) {
            console.error(e);
          }
        }
      }
    }
  },
  [managerActions.PUSH_STAGE]: async function(gameId, stage){
    let userIds;
    if(userGameRoleMap[gameId.toString()]){
      userIds = Object.keys(userGameRoleMap[gameId.toString()]).map(roleId=>userGameRoleMap[gameId.toString()][roleId.toString()]);
    }else{
      return;
    }
    let gameInstance = await gameService.getGameWithDocument(gameId, true);
    for(let userId of userIds){
      if(ctxs[userId.toString()]){
        const props = await getGameProps(ctxs[userId.toString()]);
        if(props.gameId.toString()===gameId.toString()){
          try{
            let {scenes, stories, newSceneFlag} = await gameService.calculatePushStageEffect(gameInstance, userId, stage);
            ctxs[userId.toString()].websocket.sendType({gameId, scenes, stories, newSceneFlag, stage}, managerActions.PUSH_STAGE);
          }catch (e) {
            console.error(e);
          }
        }
      }
    }
  },
  [managerActions.SEND_ENDING]: async function(gameId){
    let userIds;
    if(userGameRoleMap[gameId.toString()]){
      userIds = Object.keys(userGameRoleMap[gameId.toString()]).map(roleId=>userGameRoleMap[gameId.toString()][roleId.toString()]);
    }else{
      return;
    }
    let endings = await gameService.calculateEnding(gameId);
    for(let userId of userIds){
      if(ctxs[userId.toString()]){
        const props = await getGameProps(ctxs[userId.toString()]);
        if(props.gameId.toString()===gameId.toString()){
          try{
            ctxs[userId.toString()].websocket.sendType({gameId, endings}, managerActions.SEND_ENDING);
          }catch (e) {
            console.error(e);
          }
        }
      }
    }
  },
  [managerActions.START_GAME]:async function (gameId){
    let userIds;
    if(userGameRoleMap[gameId.toString()]){
      userIds = Object.keys(userGameRoleMap[gameId.toString()]).map(roleId=>userGameRoleMap[gameId.toString()][roleId.toString()]);
    }else{
      return;
    }
    let gameInstance = await gameService.getGameWithDocument(gameId, true);
    for(let userId of userIds){
      if(ctxs[userId.toString()]){
        const props = await getGameProps(ctxs[userId.toString()]);
        if(props.gameId.toString()===gameId.toString()){
          try{
            let {scenes, stories, newSceneFlag} = await gameService.calculatePushStageEffect(gameInstance, userId, 1);
            ctxs[userId.toString()].websocket.sendType({gameId, scenes, stories, newSceneFlag, stage:1}, managerActions.START_GAME);
          }catch (e) {
            console.error(e);
          }
        }
      }
    }
  },
  [managerActions.PAUSE_GAME]: changeGameStatusAction,
  [managerActions.RESUME_GAME]: changeGameStatusAction,
  [managerActions.OVER_GAME]: changeGameStatusAction,
};
async function changeGameStatusAction(gameId, action){
  let userIds;
  if(userGameRoleMap[gameId.toString()]){
    userIds = Object.keys(userGameRoleMap[gameId.toString()]).map(roleId=>userGameRoleMap[gameId.toString()][roleId.toString()]);
  }else{
    return;
  }
  for(let userId of userIds){
    if(ctxs[userId.toString()]){
      const props = await getGameProps(ctxs[userId.toString()]);
      if(props.gameId.toString()===gameId.toString()){
        try{
          ctxs[userId.toString()].websocket.sendType({gameId,}, action);
        }catch (e) {
          console.error(e);
        }
      }
    }
  }
}
module.exports = playWSController;
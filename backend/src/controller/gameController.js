'use strict';


/**
 * 房主相关接口
 */

const Router = require('koa-router');
const documentService = require('../service/gameDocument');
const gameService = require('../service/game');
const managerActions = require('../constant/managerActions');
const playerSender = require('../controller/websocket/playerWSController').sender;


let router = new Router();


//创建房间
router.post('/',async(ctx, next)=>{
  let {docId, level} = ctx.request.body;
  if(!docId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!level){
    level = 'normal';
  }

  ctx._data.gameId = (await gameService.createGameInstanceWithManager(ctx._userId, docId, level))._id;
});

//查找历史游戏记录
router.get('/',async(ctx, next)=>{
  ctx._data.games = await gameService.gameHistoryForUser(ctx._userId);
});


//获取进行中的游戏
router.get('/playingGames',async(ctx, next)=>{
  let {game, managerFlag} = await gameService.findPlayingGame(ctx._userId);
  ctx._data.gameId = game?game._id:null;
  ctx._data.managerFlag = managerFlag;
});

//获取未完成的游戏
router.get('/unfinished',async(ctx, next)=>{
  ctx._data.games = await gameService.getAllGameUnfinished();
});

//获取游戏详情
router.get('/:gameId',async(ctx, next)=>{
  if(!ctx.params.gameId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.game = await gameService.getGameWithDocument(ctx.params.gameId);
});

//修改游戏详情
router.put('/:gameId',async(ctx, next)=>{
  if(!ctx.params.gameId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!(await gameService.verifyManagerForGame(ctx._userId, ctx.params.gameId))){
    ctx.throw({
      code:_Exceptions.NORMAL_ERROR,
      message:'当前用户无权限操作'
    })
  }
  await gameService.checkStatusPlaying(ctx.params.gameId, ctx.request.body);
  await gameService.modifyGameStatus(ctx.params.gameId, ctx.request.body);
  if(ctx.request.body.action){
    switch (ctx.request.body.action) {
      case managerActions.ADJUST_DIFFICULTY:{
        playerSender[managerActions.ADJUST_DIFFICULTY](ctx.params.gameId, ctx.request.body.difficultyLevel);
        break;
      }
      case managerActions.START_GAME:
      case managerActions.PAUSE_GAME:
      case managerActions.RESUME_GAME:
      case managerActions.SEND_ENDING:
      case managerActions.OVER_GAME:{
        playerSender[ctx.request.body.action](ctx.params.gameId, ctx.request.body.action);
        break;
      }
      case managerActions.PUSH_STAGE:{
        playerSender[managerActions.PUSH_STAGE](ctx.params.gameId, ctx.request.body.stage);
      }
    }
  }
});

//获取游戏中的角色详情
router.get('/:gameId/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.gameId || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.role = await gameService.getRoleInGameWithDocument(ctx.params.gameId, ctx.params.roleId);
});

//修改任务完成状况
router.put('/:gameId/roles/:roleId/tasks/:taskId',async(ctx, next)=>{
  if(!ctx.params.gameId || !ctx.params.roleId || !ctx.params.taskId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!(await gameService.verifyManagerForGame(ctx._userId, ctx.params.gameId))){
    ctx.throw({
      code:_Exceptions.NORMAL_ERROR,
      message:'当前用户无权限操作'
    })
  }
  await gameService.checkStatusPlaying(ctx.params.gameId, ctx.request.body);
  await gameService.modifyTaskStatus(ctx.params.gameId, ctx.params.roleId, ctx.params.taskId, ctx.request.body.finished);
  if(ctx.request.body.action){
    playerSender[ctx.request.body.action](ctx.params.gameId, ctx.params.roleId, ctx.params.taskId);
  }
});

//获取游戏中的场景详情
router.get('/:gameId/scenes/:sceneId',async(ctx, next)=>{
  if(!ctx.params.gameId || !ctx.params.sceneId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  const {sceneInstance, gameInstance} = await gameService.getSceneInGameWithDocument(ctx.params.gameId, ctx.params.sceneId);
  const allSkills = await documentService.getSkills(gameInstance.document._id);
  ctx._data.scene = sceneInstance;
  ctx._data.allSkills = allSkills;
});

//获取游戏中的结局详情
router.get('/:gameId/endings/:endingId',async(ctx, next)=>{
  if(!ctx.params.gameId || !ctx.params.endingId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.ending = await gameService.getEndingInGameWithDocument(ctx.params.gameId, ctx.params.endingId);
});

//加入一个游戏
router.post('/:gameId/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.gameId || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  await gameService.joinGameWithRole(ctx.params.gameId, ctx.params.roleId, ctx._userId);
});

//将玩家请离游戏
router.delete('/:gameId/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.gameId || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!(await gameService.verifyManagerForGame(ctx._userId, ctx.params.gameId))){
    ctx.throw({
      code:_Exceptions.NORMAL_ERROR,
      message:'当前用户无权限操作'
    })
  }
  let playerId = await gameService.removeRoleFromGame(ctx.params.gameId, ctx.params.roleId);
  playerSender[managerActions.REMOVE_PLAYER](ctx.params.gameId, ctx.params.roleId, playerId);
});




module.exports = router;
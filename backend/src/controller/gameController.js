'use strict';


/**
 * 房主相关接口
 */

const Router = require('koa-router');
const documentService = require('../service/gameDocument');
const gameService = require('../service/game');


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
//todo handle action
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
  //todo handle action
  }
});



module.exports = router;
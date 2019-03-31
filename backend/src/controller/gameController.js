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
  const {docId} = ctx.request.body;
  if(!docId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  ctx._data.gameId = await gameService.createGameInstanceWithManager(ctx._userId, docId);
});


module.exports = router;
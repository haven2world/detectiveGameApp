'use strict';


/**
 * 游戏websocket 相关接口
 */

const Router = require('koa-router');


let router = new Router();


//游戏参与者ws
router.all('/',async(ctx, next)=>{
  ctx.websocket.on('message',message=>{
    console.log(message)
  });

});

module.exports = router;
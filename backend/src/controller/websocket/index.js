'use strict';


/**
 * websocket Router
 */

const globalInterceptor = require('./globalInterceptor');

//引入不同的webSocket
const gameWSController = require('./gamerWSController');

const routers = {
  '/detective/ws/auth/gamers':gameWSController,
};

async function wxRouter(ctx, next){
  await globalInterceptor(ctx);

  const url = ctx.request.url;

  await routers[url](ctx);

  next();
}


module.exports = wxRouter;


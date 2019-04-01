'use strict';


/**
 * websocket Router
 */

const globalInterceptor = require('./globalInterceptor');

//引入不同的webSocket
const gamerWSController = require('./playerWSController');

const routers = {
  '/detective/ws/auth/gamers':gamerWSController,
};

async function wxRouter(ctx, next){
  await globalInterceptor(ctx);

  const url = ctx.request.url;

  await routers[url](ctx);

  next();
}


module.exports = wxRouter;


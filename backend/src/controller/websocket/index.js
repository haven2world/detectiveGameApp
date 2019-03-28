'use strict';


/**
 * websocket Router
 */

const globalInterceptor = require('./globalInterceptor');

//引入不同的webSocket
const gamerWSController = require('./gamerWSController');
const managerWSController = require('./managerWSController');

const routers = {
  '/detective/ws/auth/gamers':gamerWSController,
  '/detective/ws/auth/managers':managerWSController,
};

async function wxRouter(ctx, next){
  await globalInterceptor(ctx);

  const url = ctx.request.url;

  await routers[url](ctx);

  next();
}


module.exports = wxRouter;


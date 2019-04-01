'use strict';


/**
 * 初始化mongodb相关设置
 */

const mongoose = require('mongoose');

let init = ()=>{
  mongoose.set('useCreateIndex', true);
  //mongodb 连接
  mongoose.connect(global._Config.mongodb,{
    keepAlive:true,
    keepAliveInitialDelay:300000,
    useNewUrlParser: true
  });

  let db = mongoose.connection;
  db.on('error', (err)=>{console.log(err)})
  db.once('open', function() {
    console.log('connected')
  });
  db = null;
}


module.exports = {
  init
};
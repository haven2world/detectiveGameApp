'use strict';


/**
 * 开发配置
 */
const path = require('path');

const config = {
  mongodb:'mongodb://localhost:27017/detective',
  baseUrl:'/detective',

//  文件路径
  path:{
    avatar:path.resolve( __dirname ,'../static/detective/assets/avatar')
  }
};

module.exports = config;
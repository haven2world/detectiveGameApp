'use strict';


/**
 * 游戏相关服务
 */

const document = require('../dao/document');
const commonUtils = require('../utils/commonUtils');

const dao = {
//  创建一个剧本
  async createDocument(prop){
    let document = new Document(prop);
    return await document.save();
  },

};

module.exports = dao;
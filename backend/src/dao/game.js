'use strict';


/**
 * 操作 game model
 */

const Game = require('../model/gameInstance');

const dao = {
//  查找一个用户创建的剧本列表
  async queryDocumentsForCreator(userId){
    return await Game.find({creator:userId}, {name:1, description:1, publishFlag:1, roles:1, updateTime:1})
  },

};

module.exports = dao;
'use strict';


/**
 * 游戏相关服务
 */

const document = require('../dao/document');
const game = require('../dao/game');
const commonUtils = require('../utils/commonUtils');
const documentService = require('../service/gameDocument');

const service = {
//  初始化并创建一个游戏
  async createGameInstanceWithManager(userId, docId){
    let doc = document.getDocumentById(docId);
    if(!doc){
      throw {
        message:'未找到该剧本'
      }
    }
    const basicGame = {
      manager:userId,
      stage:0,
      status:'preparation',
      // difficultyLevel:difficultyLevelSchema,
    };
    let result = await game.createDocument({...basicGame, document:docId});
    if(!result){
      throw {message:'创建游戏失败'}
    }
  },

};

module.exports = service;
'use strict';


/**
 * 游戏相关服务
 */

const document = require('../dao/document');
const game = require('../dao/game');
const commonUtils = require('../utils/commonUtils');
const documentService = require('../service/gameDocument');
const gameStatus = require('../constant/gameStatus');

const service = {
//  查找某房主名下的未结束游戏
  async couldCreateGame(userId){
    let gameInstance = await game.findPlayingGameForManager(userId);
    return !gameInstance;
  },
//  验证用户为某游戏房主
  async verifyManagerForGame(userId, gameId){
    let gameInstance = await game.findGameById(gameId);
    return gameInstance.manager.toString() === userId;
  },
//  初始化并创建一个游戏
  async createGameInstanceWithManager(userId, docId, level){
    if(!await service.couldCreateGame(userId)){
      throw {
       code:global._Exceptions.NORMAL_ERROR,
       message:'当前用户存在尚未结束的游戏，无法创建新游戏'
      }
    }

    let doc = await document.getDocumentById(docId);
    if(!doc){
      throw {
        message:'未找到该剧本'
      }
    }
    const basicGame = {
      manager:userId,
      stage:0,
      status:gameStatus.preparation,
      sentEnding:false,
      difficultyLevel:{
        maxInquiryTimes: doc.level[level].maxInquiryTimes,
        keepClueSecret: doc.level[level].keepClueSecret,
      },
    };
    let result = await game.createGame({...basicGame, document:docId});
    if(!result){
      throw {message:'创建游戏失败'}
    }
    return result;
  },
//获取一个游戏和它对应的剧本
  async getGameWithDocument(gameId){
    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    return gameInstance;
  },
//获取玩家正在参与的游戏
  async findPlayingGame(userId){
    let managerFlag = true;
    let gameInstance = await game.findPlayingGameForManager(userId);
    if(gameInstance){
      return {game: gameInstance,managerFlag};
    }
    gameInstance = await game.findPlayingGameForPlayer(userId);
    managerFlag = false;
    return {game: gameInstance,managerFlag};
  },
  //  修改游戏状态
  async modifyGameStatus(docId, endingId, param){
    const field = {
      status:true,
      stage:true,
      difficultyLevel:true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
    }
    await game.updateDetail(docId, endingId, paramToSet);
  },
};

module.exports = service;
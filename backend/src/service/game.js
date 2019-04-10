'use strict';


/**
 * 游戏相关服务
 */

const document = require('../dao/document');
const game = require('../dao/game');
const documentService = require('../service/gameDocument');
const gameStatus = require('../constant/gameStatus');

const service = {
//  查找某房主名下的未结束游戏
  async couldCreateGame(userId){
    let gameInstance = await game.findPlayingGameForManager(userId);
    return !gameInstance;
  },
//  查找所有游戏历史
  async gameHistoryForUser(userId){
    let data = {manage:[],play:[]};
    data.manage = await game.findAllGameForManager(userId);
    data.play = await game.findAllGameForPlayer(userId);
    return data;
  },
//  验证用户为某游戏房主
  async verifyManagerForGame(userId, gameId){
    let gameInstance = await game.findGameById(gameId);
    return gameInstance.manager.toString() === userId;
  },
//  检查当前游戏可操作
  async checkStatusPlaying(gameId, param){
    let gameInstance = await game.findGameById(gameId);
    if(gameInstance.status === gameStatus.playing){
      return true;
    }else if(param && param.status && param.status === gameStatus.playing){
      return true
    }else if(gameInstance.status === gameStatus.preparation){
      throw {
        code:global._Exceptions.NORMAL_ERROR,
        message:'游戏尚未开始，无法操作'
      }
    }else if(gameInstance.status === gameStatus.over){
      throw {
        code:global._Exceptions.NORMAL_ERROR,
        message:'游戏已结束，无法操作'
      }
    }else if(gameInstance.status === gameStatus.pause){
      throw {
        code:global._Exceptions.NORMAL_ERROR,
        message:'游戏已暂停，无法操作,请联系房主'
      }
    }
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
  async modifyGameStatus(gameId, param){
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
    await game.updateDetail(gameId, paramToSet);
  },
//  获取游戏中的角色
  async getRoleInGameWithDocument(gameId, roleId){
    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    let roleInstance = gameInstance.roles.id(roleId);
    roleInstance = roleInstance.toObject();
    service.assembleDocumentToRole(gameInstance.document, roleInstance);
    roleInstance.clues.forEach(clue=>service.assembleDocumentToClue(gameInstance.document, clue));
    let {tasks} = await document.getTaskForRole(gameInstance.document, roleInstance.document._id);
    roleInstance.tasks = tasks;

    return roleInstance;
  },
//  组装role document
  async assembleDocumentToRole(document, role){
    let roleDoc = document.roles.id(role.roleDocumentId);
    role.document = roleDoc.toObject();
    return role;
  },
//  组装clue document
  async assembleDocumentToClue(document, clue){
    let sceneDoc = document.scenes.id(clue.sceneId);
    let clueDoc = sceneDoc.clues.id(clue.clueDocumentId);
    clue.document = clueDoc.toObject();
    clue.scene = sceneDoc.name;
    return clue;
  },
//修改任务完成状况
  async modifyTaskStatus(gameId, roleId, taskId, finished){
    await game.updateTaskStatus(gameId, roleId, taskId, finished);
  },
};

module.exports = service;
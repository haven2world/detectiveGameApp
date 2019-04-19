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
  async couldCreateGame(userId) {
    let gameInstance = await game.findPlayingGameForManager(userId);
    return !gameInstance;
  },
//  查找所有游戏历史
  async gameHistoryForUser(userId) {
    let data = {manage: [], play: []};
    data.manage = await game.findAllGameForManager(userId);
    data.play = await game.findAllGameForPlayer(userId);
    return data;
  },
//  验证用户为某游戏房主
  async verifyManagerForGame(userId, gameId) {
    let gameInstance = await game.findGameById(gameId);
    return gameInstance.manager.toString() === userId;
  },
//  检查当前游戏可操作
  async checkStatusPlaying(gameId, param) {
    let gameInstance = await game.findGameById(gameId);
    if (gameInstance.status === gameStatus.playing) {
      return true;
    } else if (param && param.status && param.status === gameStatus.playing) {
      return true
    } else if (gameInstance.status === gameStatus.preparation) {
      throw {
        code: global._Exceptions.NORMAL_ERROR,
        message: '游戏尚未开始，无法操作'
      }
    } else if (gameInstance.status === gameStatus.over) {
      throw {
        code: global._Exceptions.NORMAL_ERROR,
        message: '游戏已结束，无法操作'
      }
    } else if (gameInstance.status === gameStatus.pause) {
      throw {
        code: global._Exceptions.NORMAL_ERROR,
        message: '游戏已暂停，无法操作,请联系房主'
      }
    }
  },
//  初始化并创建一个游戏
  async createGameInstanceWithManager(userId, docId, level) {
    if (!await service.couldCreateGame(userId)) {
      throw {
        code: global._Exceptions.NORMAL_ERROR,
        message: '当前用户存在尚未结束的游戏，无法创建新游戏'
      }
    }

    let doc = await document.getDocumentById(docId);
    if (!doc) {
      throw {
        message: '未找到该剧本'
      }
    }
    const basicGame = {
      manager: userId,
      stage: 0,
      status: gameStatus.preparation,
      sentEnding: false,
      difficultyLevel: {
        maxInquiryTimes: doc.level[level].maxInquiryTimes,
        keepClueSecret: doc.level[level].keepClueSecret,
      },
    };
    let result = await game.createGame({...basicGame, document: docId});
    if (!result) {
      throw {message: '创建游戏失败'}
    }
    return result;
  },
//获取一个游戏和它对应的剧本
  async getGameWithDocument(gameId) {
    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    return gameInstance;
  },
//获取玩家正在参与的游戏
  async findPlayingGame(userId) {
    let managerFlag = true;
    let gameInstance = await game.findPlayingGameForManager(userId);
    if (gameInstance) {
      return {game: gameInstance, managerFlag};
    }
    gameInstance = await game.findPlayingGameForPlayer(userId);
    managerFlag = false;
    return {game: gameInstance, managerFlag};
  },
  //获取玩家参与的游戏与全部剧本
  async findPlayingGameAndCompleteDocument(userId){
    return await game.findPlayingGameForPlayer(userId, true);
  },
  //  修改游戏状态
  async modifyGameStatus(gameId, param) {
    const field = {
      status: true,
      stage: true,
      difficultyLevel: true,
    };

    let paramToSet = {};
    for (let key in param) {
      if (field[key]) {
        paramToSet[key] = param[key];
      }
    }
    await game.updateDetail(gameId, paramToSet);
  },
//  获取游戏中的角色
  async getRoleInGameWithDocument(gameId, roleId) {
    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    let roleInstance = gameInstance.roles.id(roleId);
    roleInstance = roleInstance.toObject();
    service.assembleDocumentToRole(gameInstance.document, roleInstance);
    roleInstance.clues.forEach(async clue => await service.assembleDocumentToClue(gameInstance.document, clue));
    let {tasks} = await document.getTaskForRole(gameInstance.document, roleInstance.document._id);
    roleInstance.tasks = tasks;

    return roleInstance;
  },
//  获取游戏中的场景
  async getSceneInGameWithDocument(gameId, sceneId) {
    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    let sceneInstance = gameInstance.document.scenes.id(sceneId).toObject();
    await service.assembleGameStatusToCluesDocument(gameInstance, sceneInstance.clues);

    return {sceneInstance, gameInstance};
  },
//  获取游戏中的结局
  async getEndingInGameWithDocument(gameId, endingId) {
    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    let endingInstance = await documentService.getEndingDetail(gameInstance.document._id, endingId);
    endingInstance.roles = gameInstance.roles;
    return endingInstance;
  },
//  组装 role document
  async assembleDocumentToRole(documentInstance, role) {
    let roleDoc = documentInstance.roles.id(role.roleDocumentId);
    role.document = roleDoc.toObject();
    return role;
  },
//  组装 clue document
  async assembleDocumentToClue(documentInstance, clue) {
    let sceneDoc = documentInstance.scenes.id(clue.sceneId);
    let clueDoc = sceneDoc.clues.id(clue.clueDocumentId);
    clue.document = clueDoc.toObject();
    clue.scene = sceneDoc.name;
    return clue;
  },
//  组装 clue game status
  async assembleGameStatusToCluesDocument(gameInstance, clues) {
    let documentInstance = gameInstance.document;
    gameInstance = gameInstance.toObject();
    let clueMap = {};
    gameInstance.roles.forEach(async role => {
      await service.assembleDocumentToRole(documentInstance, role);
      role.clues.forEach(clue => {
        let temp = clueMap[clue.clueDocumentId] || {founder: [], shared: false, sceneId: clue.sceneId,};
        temp.founder.push({_id: clue.founder, name: role.document.name});
        temp.shared = temp.shared || clue.shared;
        clueMap[clue.clueDocumentId] = temp;
      });
    });

    clues.forEach(clue => {
      clue.gameStatus = clueMap[clue._id];
    });
    return clues;
  },
//修改任务完成状况
  async modifyTaskStatus(gameId, roleId, taskId, finished) {
    await game.updateTaskStatus(gameId, roleId, taskId, finished);
  },
//  获取所有未完成的游戏
  async getAllGameUnfinished() {
    return await game.findAllGameUnfinished()
  },
//  加入一个游戏扮演一个角色
  async joinGameWithRole(gameId, roleId, userId) {
    let {game:playingGame} = await service.findPlayingGame(userId);
    if(playingGame){
      throw {
       code:_Exceptions.NORMAL_ERROR,
       message:'请先结束正在进行中的游戏'
      }
    }

    let gameInstance = await game.getGamePopulateBasicDoc(gameId);
    let roleDoc = gameInstance.document.roles.id(roleId);
    if(!roleDoc){
      throw {
        message:'未找到角色'
      }
    }

    let role = {
      roleDocumentId: roleId,
      skillUse: roleDoc.skills.map(i=>({count:0})),
      player:userId,
      finishedTask:{}
    };
    await game.addPlayerToGameAndCreateRole(gameId, role, userId, gameInstance);
  },
//  移除一个角色扮演者
  async removeRoleFromGame(gameId, roleId) {
    return await game.removeRoleAndItsPlayer(gameId, roleId);
  },
//  初始化玩家数据
  async generatePlayerData(game, userId){

    let result = game.toObject();

    //去除游戏中其他玩家的消息
    let role = null;
    result.roles.forEach(item=>{
      if(item.player.toString()===userId.toString()){
        role = item;
      }else{
        delete item.messages
      }
    });
    //增加其他玩家共享的线索
    role.sharedClues = await service.findCluesOtherPlayersShared(game, userId);

    //组装文档
    await service.assembleDocumentToRole(game.document, role);
    role.clues.forEach(async clue=>{await service.assembleDocumentToClue(game.document, clue)});
    role.sharedClues.forEach(async clue=>{await service.assembleDocumentToClue(game.document, clue)});

    //清洗剧本中其他玩家的信息
    await service.cleanOtherPlayersInfo(result, role.roleDocumentId);
    //去除剧本中的线索与非当前阶段的场景和故事
    await service.cleanStorySceneAndClue(result);

    //检查是否发送结局
    if(!game.sentEnding){
      delete result.document.endings;
    }

    return result;
  },
//  查找其他玩家共享的线索
  async findCluesOtherPlayersShared(game, userId){
    game = game.toObject();
    let result = [];
    game.roles.forEach(role=>{
      if(role.player.toString() !== userId.toString()){
        role.clues.forEach(clue=>{
          if(clue.shared){
            result.push(clue);
          }
        });
      }
    });
    return result;
  },
//  清洗剧本中其他玩家的信息
  async cleanOtherPlayersInfo(gameObject, roleDocId){
    const doc = gameObject.document;
  //  去除其他玩家的技能信息
    doc.roles.forEach(role=>{
      if(role._id.toString() !== roleDocId.toString()){
        delete role.skills;
      }
    });
  //  去除其他玩家的剧本
    doc.stories = doc.stories.filter(story=>story.belongToRoleId.toString() === roleDocId.toString());
  //  去除其他玩家的任务
    doc.tasks = doc.tasks.filter(task=>task.belongToRoleId.toString() === roleDocId.toString());

  },
  //去除剧本中的线索与非当前阶段的场景
  async cleanStorySceneAndClue(gameObject){
    const currentStage = gameObject.stage;
    const doc = gameObject.document;
    doc.scenes = doc.scenes.filter(scene=>{
      delete scene.clues;
      return scene.enableStage <= currentStage;
    });
    doc.stories = doc.stories.filter(story=>story.stage <= currentStage);
  }
};

module.exports = service;
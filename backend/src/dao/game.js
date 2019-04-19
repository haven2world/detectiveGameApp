'use strict';


/**
 * 操作 game model
 */

const Game = require('../model/gameInstance');
const gameStatus = require('../constant/gameStatus');

const dao = {
  //  通过id查找游戏
  async findGameById(gameId){
    return await Game.findById(gameId);
  },
//  查找房主名下未结束的游戏
  async findPlayingGameForManager(userId){
    return await Game.findOne({manager:userId, status:{$ne:gameStatus.over}});
  },
//  查找玩家名下未结束的游戏
  async findPlayingGameForPlayer(userId, populateFlag){
    if(populateFlag){
      return await Game.findOne({players: userId, status: {$ne: gameStatus.over}})
        .populate({
          path: 'document',
          populate: {
            path: 'roles.skills.skillInfo'
          }
        })
        .populate('players', ['loginId']);;
    }else{
      return await Game.findOne({players: userId, status:{$ne:gameStatus.over}});
    }
  },
  //  查找房主名下未结束的游戏
  async findAllGameForManager(userId){
    return await Game.find({manager:userId}).populate('document',['name']);
  },
//  查找玩家名下未结束的游戏
  async findAllGameForPlayer(userId){
    return await Game.find({players: userId}).populate('document',['name']);
  },
//  查找所有下未结束的游戏
  async findAllGameUnfinished(){
    return await Game.find({status:{$ne:gameStatus.over}}).populate('document',['name','description','roles']);
  },
//  创建一个剧本
  async createGame(prop){
    let game = new Game(prop);
    return await game.save();
  },
//  获取一个游戏和它的剧本
  async getGamePopulateBasicDoc(gameId){
    let gameWithBasicDoc = await Game.findById(gameId)
      .populate({
        path:'document',
        select:['name', 'roles', 'scenes', 'endings', 'storyStageCount'],
        populate:{
          path:'roles.skills.skillInfo'
        }
      })
      .populate('players', ['loginId']);
    return gameWithBasicDoc;
  },
  // 修改游戏属性
  async updateDetail(id, param){
    return await Game.updateOne({_id:id,},{
      $set:param,
      $currentDate:{updateTime:true}
    })
  },
  // 修改任务完成状态
  async updateTaskStatus(gameId, roleId, taskId, finished){
    let game = await Game.findById(gameId);
    let finishedTask = game.roles.id(roleId).finishedTask;
    if(finishedTask[taskId.toString()] !== finished){
      let roleIndex = game.roles.findIndex(role=>role._id.toString()===roleId.toString());
      finishedTask[taskId.toString()] = finished;
      game.updateTime = new Date();
      game.markModified(`roles.${roleIndex}.finishedTask`);
      await game.save();
    }
    return true;
  },
//  为一个游戏添加玩家
  async addPlayerToGameAndCreateRole(gameId, role, userId, gameInstance){
    if(!gameInstance){
      gameInstance = await Game.findById(gameId);
    }
    let roleInstance = gameInstance.roles.create(role);
    gameInstance.roles.push(roleInstance);
    gameInstance.players.push(userId);
    await gameInstance.save();
  },
//  移除一个角色扮演者
  async removeRoleAndItsPlayer(gameId, roleId){
    let gameInstance = await Game.findById(gameId);
    let roleInstance = gameInstance.roles.id(roleId);
    let playerId = roleInstance.player;
    gameInstance.players = gameInstance.players.filter(item=>item.toString()!==playerId.toString());
    roleInstance.remove(roleId);
    await gameInstance.save();
  },
};

module.exports = dao;
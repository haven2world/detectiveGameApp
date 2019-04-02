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
  async findPlayingGameForPlayer(userId){
    return await Game.findOne({players: userId, status:{$ne:gameStatus.over}});
  },
//  创建一个剧本
  async createGame(prop){
    let game = new Game(prop);
    return await game.save();
  },
//  获取一个游戏和它的剧本
  async getGamePopulateBasicDoc(gameId){
    let gameWithBasicDoc = await Game.findById(gameId).populate('document', ['name', 'roles', 'scenes', 'endings', 'storyStageCount']);
    return gameWithBasicDoc;
  },
  // 修改游戏属性
  async updateDetail(id, param){
    return await Game.updateOne({_id:id,},{
      $set:param,
      $currentDate:{updateTime:true}
    })
  },
};

module.exports = dao;
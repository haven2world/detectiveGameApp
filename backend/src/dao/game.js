'use strict';


/**
 * 操作 game model
 */

const Game = require('../model/gameInstance');
const gameStatus = require('../constant/gameStatus');

const dao = {
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
    let gameWithBasicDoc = await Game.findById(gameId).populate('document', ['name', 'roles', 'scenes', 'endings']);
    return gameWithBasicDoc;
  },
};

module.exports = dao;
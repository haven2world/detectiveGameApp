'use strict';


/**
 * 操作 game model
 */

const Game = require('../model/gameInstance');

const dao = {
//  创建一个剧本
  async createGame(prop){
    let game = new Game(prop);
    return await game.save();
  },
};

module.exports = dao;
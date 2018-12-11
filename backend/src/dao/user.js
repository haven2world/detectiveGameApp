'use strict';


/**
 * 操作user model
 */

const User = require('../model/user');

module.exports = {
//  查找用户
  async findUserByLoginId(loginId){
    return await User.findOne({loginId:loginId})
  },

//  创建账户
  async createAccount(loginId, passwordHash, salt, token){
    let user = new User({
      loginId, passwordHash, salt, token
    })
    return await user.save()
  },



};
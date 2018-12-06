'use strict';


/**
 * 操作user model
 */

const User = require('../model/user');

module.exports = {
//  查找用户
  findUserByLoginId(loginId){
    return User.findOne({loginId:loginId})
  },

//  创建账户
  createAccount(loginId, passwordHash, salt){
    let user = new User({
      loginId, passwordHash, salt
    })
    return user.save()
  }
};
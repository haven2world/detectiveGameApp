'use strict';


/**
 * 用户相关服务
 */
const user = require('../dao/user');
const passwordService = require('./password');

module.exports = {
//  创建用户
  async createUser(loginId, password){
    let result = await user.findUserByLoginId(loginId);
    console.log(result)
    if(result){
      throw {
        code:global._Exceptions.PARAM_ERROR,
        message:'账号重复，请重新输入'
      }
    }
    let {hash, salt} = passwordService.getPasswordHash(password);
    let createResult = await user.createAccount(loginId, hash, salt);
  }
}
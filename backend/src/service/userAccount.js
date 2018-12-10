'use strict';


/**
 * 用户相关服务
 */
const user = require('../dao/user');
const passwordService = require('./password');
const tokenService = require('./token');

module.exports = {
//  创建用户
  async createUser(loginId, password){
    let result = await user.findUserByLoginId(loginId);
    if(result){
      throw {
        code:global._Exceptions.PARAM_ERROR,
        message:'账号重复，请重新输入'
      }
    }
    let {hash, salt} = passwordService.getPasswordHash(password);
    let token = await tokenService.create(loginId);
    let createResult = await user.createAccount(loginId, hash, salt, token);
    console.log('creat User :\n',createResult)
    return createResult
  },
//  登录
  async login(){

  }
}
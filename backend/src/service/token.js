'use strict';


/**
 *  token 相关服务
 */
const jwt = require('jsonwebtoken');
const user = require('../dao/user');

const privateKey = 'detectiveSherlockHolmesChen';

module.exports = {
//生成token
  async create(loginId){
    return await jwt.sign({loginId}, privateKey)
  },
//  校验token
  async verify(token){
    try{
      let payload = await jwt.verify(token, privateKey);
      const loginId = payload.loginId;
      let theUser = await user.findUserByLoginId(loginId);

      if(theUser.token !== token){
        console.log('用户token不一致');
        throw null
      }

      return payload;
    }catch (e) {
      e && console.log(e);
      throw {
        code:global._Exceptions.TOKEN_ERROR,
        message:'登录失效，请重新登录'
      }
    }
  }

}
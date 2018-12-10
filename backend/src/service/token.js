'use strict';


/**
 *  token 相关服务
 */
const jwt = require('jsonwebtoken');

const privateKey = 'detectiveSherlockHolmesChen';

module.exports = {
//生成token
  async create(loginId){
    let result = await jwt.sign({loginId}, privateKey);
    return result
  },

}
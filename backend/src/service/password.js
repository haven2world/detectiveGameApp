'use strict';


/**
 * 密码相关服务
 */
const rand = require('csprng');//生成随机盐
const Hashes = require('jshashes')//哈希算法

let service = {
  //创建新盐和hash
  getNewPasswordHash(pwdHash) {
    let newSalt = rand(160, 36);
    let resultHash = service.getPasswordHash(pwdHash, newSalt);
    return {
      hash: resultHash,
      salt: newSalt
    }
  },
  //根据盐和密码获取hash
  getPasswordHash(pwdHash, salt){
    return new Hashes.SHA1().b64(pwdHash + salt);
  }
};

module.exports = service;

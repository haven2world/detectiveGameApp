'use strict';


/**
 * 密码相关服务
 */
const rand = require('csprng');//生成随机盐
const Hashes = require('jshashes')//哈希算法


module.exports = {
  getPasswordHash(pwdHash) {
    let newSalt = rand(160, 36);
    let resultHash = new Hashes.SHA1().b64(pwdHash + newSalt);
    return {
      hash: resultHash,
      salt: newSalt
    }
  }
}

'use strict';


/**
 * 剧本相关服务
 */

const user = require('../dao/user');
const document = require('../dao/document');
const passwordService = require('./password');
const tokenService = require('./token');

module.exports = {
//  获取用户创建的剧本
  async getDocumentsForCreator(id){
    let result = await document.queryDocumentsForCreator(id);
    return result||[]
  },
//  初始化并创建一个剧本
  async createDocumentWithNameAndUser(name, user){
    const basicDocument = {
      isPrivate:true,
      creator:user,
      publishFlag:false,
      composingStage:'name',
      level:{
        easy:{
          maxInquiryTimes:null,
          keepClueSecret:false,
        },
        normal:{
          maxInquiryTimes:10,
          keepClueSecret:false,
        },
        hard:{
          maxInquiryTimes:10,
          keepClueSecret:true,
        }
      }
    }
    let result = await document.createDocument({...basicDocument, name});
    if(!result){
      throw {message:'创建剧本失败'}
    }
  }
}


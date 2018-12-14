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
    let result = await document.queryDocumentsForCreator(id)||[];
    result.forEach((item)=>{
      item._doc.roleCount = item.roles.length;
      delete item._doc.roles;
    });
    return result
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
  },
//  获取一个剧本的详情
  async getDocumentDetail(id){
    return await document.getDocumentById(id);
  },
//  修改一个剧本的基础信息
  async modifyBasicInfo(id, param){
    const field = {
      name: true,
      description: true,
      publishFlag: true,
      composingStage: true,
      level: true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
    }
    await document.updateBasicInfo(id, paramToSet);
  }
}


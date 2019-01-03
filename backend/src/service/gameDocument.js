'use strict';


/**
 * 剧本相关服务
 */

const document = require('../dao/document');
const fileService = require('./fileService');
const skill = require('../dao/skill');
const commonUtils = require('../utils/commonUtils');

const service = {
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
  },
//  创建一个角色
  async createRole(docId, name){
    let {doc, role} = await document.createRole(docId, name);
    if(role && doc.composingStage === 'role'){
      doc.composingStage = 'story';
      await doc.save();
    }
    return {composingStage:doc.composingStage, role}
  },
  //  获取一个角色
  async getRole(docId, roleId){
    let document  = await service.getDocumentDetail(docId);
    return  document.roles.id(roleId)
  },
//  删除一个角色
  async deleteRole(docId, roleId){
    let document  = await service.getDocumentDetail(docId);
    document.roles.id(roleId).remove();
    await document.save();
    return true
  },
//  修改一个角色的头像
  async modifyRoleAvatar(docId, roleId, file){
    let fileName = commonUtils.GenID()+ '_' + file.name;
    let url = _Config.path.avatar + '/' + fileName;
    let path = commonUtils.convertAbsPath(url);

    let successful = await fileService.saveFile(path, file.path);
    if(successful){
      await document.updateRoleInfo(docId, roleId, {photo:url});
      return url
    }
  },
//  修改角色信息
  async modifyRoleInfo(docId, roleId, param){
    const field = {
      name: true,
      description: true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
    }
    await document.updateRoleInfo(docId, roleId, paramToSet);
  },
//  获取当前剧本下的所有技能
  async getSkills(docId){
    return await skill.findSkillByDocId(docId)
  }
};

module.exports = service;


'use strict';


/**
 * 剧本相关服务
 */

const document = require('../dao/document');
const fileService = require('./file');
const skillService = require('./skill');
const skill = require('../dao/skill');
const commonUtils = require('../utils/commonUtils');

//编写阶段
const stageList = [
  'name',
  'role',
  'story',
  'scene'
];

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
      composingStage:stageList[0],
      storyStageCount:1,
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
    };
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
//  推动剧本编写阶段
  async changeDocumentComposingStage(docInstance, stage){
    if(!docInstance){
      throw {message:'无有效剧本'}
    }
    let currentStageIndex = stageList.findIndex(item=>item===docInstance.composingStage);
    let targetStageIndex = stageList.findIndex(item=>item===stage);
    if(targetStageIndex>=currentStageIndex){
      docInstance.composingStage = stage;
      await docInstance.save();
    }
  },
//  创建一个角色
  async createRole(docId, name){
    let {doc, role} = await document.createRole(docId, name);
    service.changeDocumentComposingStage(doc, 'story');
    return {composingStage:doc.composingStage, role}
  },
  //  获取一个角色
  async getRole(docId, roleId){
    return await document.getRole(docId, roleId);
  },
//  删除一个角色
  async deleteRole(docId, roleId){
    let result = await service.deleteRole(docId, roleId);
    return !!result
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
  },
// 在某个角色下增加技能
  async addSkillForRole(name, docId, roleId){
    let theSkill = await skill.findSkillByNameAndDocId(name, docId);
    if(!theSkill){
      theSkill = await skillService.createSkillForDoc(name,docId);
    }
    let result = await document.addSkillForRole(docId, roleId, theSkill._id);
    result._doc.skillInfo = theSkill;
    return result;
  },

// 修改某个角色某个技能的使用最大次数
  async modifySkillCount(docId, roleId, skillId, count){
    let result = await document.updateSkillCount(docId, roleId, skillId, count);
    if(!result){
      throw {code:_Exceptions.DB_ERROR, message:'数据库操作失败'};
    }
  },

  // 删除某个角色某个技能
  async deleteSkillForRole(docId, roleId, roleSkillId){
    let result = await document.deleteSkillForRole(docId, roleId, roleSkillId);
    if(!result){
      throw {code:_Exceptions.DB_ERROR, message:'数据库操作失败'};
    }
  },

  // 增加故事阶段
  async addStoryStage(docId){
    let currentStageCount = await document.createStoryStage(docId);

    return currentStageCount
  },

  //减少一个故事阶段
  async reduceStoryStage(docId){
    let currentStageCount = await document.reduceStoryStage(docId);

    return currentStageCount
  },

  //  获取某阶段的故事列表
  async getAllRolesStoriesInStage(docId, stageCount){
    let doc = await document.getDocumentById(docId);
    let roles = doc.roles.toObject();
    let storyMap = {};
    doc.stories.forEach(story=>{
      if(story.stage === Number(stageCount)){
        storyMap[story.belongToRoleId] = story;
      }
    });
    roles.forEach(role=>{
      role.story = storyMap[role._id];
    });
    return roles;
  },

//  创建新故事
  async createStory(docId, roleId, stageCount, content){
    let {doc, roleInstance} = await document.createStoryInDocument(docId,{stage:stageCount,content,belongToRoleId:roleId});
    service.changeDocumentComposingStage(doc, 'scene');
    return roleInstance;
  },

//  修改故事
  async modifyStory(docId,storyId,content){
    let result = await document.modifyStoryContent(docId, storyId, content);
    return !!result;
  },

};



module.exports = service;


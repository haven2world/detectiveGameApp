'use strict';


/**
 * 操作 document model
 */

const Document = require('../model/gameDocument');

const dao = {
//  查找一个用户创建的剧本列表
  async queryDocumentsForCreator(userId){
    return await Document.find({creator:userId}, {name:1, description:1, publishFlag:1, roles:1, updateTime:1})
  },
//  创建一个剧本
  async createDocument(prop){
    let document = new Document(prop);
    return await document.save();
  },
//获取一个剧本详情
  async getDocumentById(id){
    return await Document.findById(id)
  },
//修改剧本基础信息
  async updateBasicInfo(id, param){
    return await Document.updateOne({_id:id},{
      $set:param,
      $currentDate:{updateTime:true}
    });
  },
//  修改角色信息
  async updateRoleInfo(id, roleId, roleParam){
    let param = {};
    Object.keys(roleParam).forEach(key=>{
      param['roles.$.' + key] = roleParam[key];
    });
    return await Document.updateOne({_id:id, 'roles._id':roleId},{
      $set:param,
      $currentDate:{updateTime:true}
    })
  },
//  获取一个角色的信息
  async getRole(docId, roleId){
    let documentWithSkillInfo = await Document.findById(docId).populate('roles.skills.skillInfo');
    return documentWithSkillInfo.roles.id(roleId);
  },
//  创建一个角色
  async createRole(docId, name){
    let doc = await Document.findById(docId);
    let role = await doc.roles.create({name});
    doc.roles.push(role);
    doc.updateTime = new Date();
    await doc.save();
    return {doc, role}
  },
//  删除角色
  async deleteRole(docId, roleId){
    let document  = await Document.findById(id);
    document.roles.id(roleId).remove();
    let storyArr = [];
    document.stories.forEach(story=>{
      if(story.belongToRoleId.toString()===roleId){
        storyArr.push(story._id);
      }
    });
    storyArr.forEach(storyId=>{
      document.stories.pull(storyId);
    });

    await document.save();
  },
//  为一个角色增加一个技能
  async addSkillForRole(docId, roleId, skillId){
    let doc = await Document.findById(docId);
    let role = await doc.roles.id(roleId);
    let skill = await role.skills.create({skillInfo:skillId});
    role.skills.push(skill);
    doc.updateTime = new Date();
    await doc.save();
    return skill;
  },
// 修改某个角色某个技能的使用最大次数
  async updateSkillCount(docId, roleId, skillId, count){
    let doc = await Document.findById(docId);
    let role = await doc.roles.id(roleId);
    let skill = role.skills.find(skill=>skill.skillInfo.toString() === skillId);
    skill.maxCount = count;
    doc.updateTime = new Date();
    let result = await doc.save();
    return !!result;
  },
  // 删除某个角色某个技能
  async deleteSkillForRole(docId, roleId, roleSkillId){
    let doc = await Document.findById(docId);
    let role = await doc.roles.id(roleId);
    role.skills.id(roleSkillId).remove();
    doc.updateTime = new Date();
    let result = await doc.save();
    return !!result;
  },
//  创建一个故事阶段
  async createStoryStage(docId){
    let doc = await Document.findById(docId);
    if(typeof doc.storyStageCount === 'undefined'){
      doc.storyStageCount = 0;
    }
    doc.storyStageCount += 1;
    doc.updateTime = new Date();
    await doc.save();
    return doc.storyStageCount
  },

//  减少一个故事阶段
  async reduceStoryStage(docId){
    let doc = await Document.findById(docId);
    if(typeof doc.storyStageCount === 'undefined' || doc.storyStageCount === 0){
      doc.storyStageCount = 0;
      await doc.save();
      throw {message:'无可用阶段'}
    }

    let storyArr = [];
    doc.stories.forEach(story=>{
      if(story.stage===doc.storyStageCount-1){
        storyArr.push(story._id);
      }
    });
    storyArr.forEach(storyId=>{
      doc.stories.pull(storyId);
    });

    doc.storyStageCount -= 1;
    doc.updateTime = new Date();
    await doc.save();
    return doc.storyStageCount
  },

// 创建一个故事
  async createStoryInDocument(docId, story){
    let doc = await Document.findById(docId);
    let roleInstance = await doc.stories.create(story);
    doc.stories.push(roleInstance);
    doc.updateTime = new Date();
    console.log(doc)
    await doc.save();
    return roleInstance;
  },

//  修改故事
  async modifyStoryContent(docId, storyId, content){
    return await Document.updateOne({_id:docId, 'stories._id':storyId},{
      $set:{'stories.$.content':content},
      $currentDate:{updateTime:true}
    })
  }
};

module.exports = dao;
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
    await doc.save();
    return {doc, roleInstance};
  },
//  修改故事
  async modifyStoryContent(docId, storyId, content){
    return await Document.updateOne({_id:docId, 'stories._id':storyId},{
      $set:{'stories.$.content':content},
      $currentDate:{updateTime:true}
    })
  },
// 创建一个故事
  async createSceneInDocument(docId, scene){
    let doc = await Document.findById(docId);
    let sceneInstance = await doc.scenes.create(scene);
    doc.scenes.push(sceneInstance);
    doc.updateTime = new Date();
    await doc.save();
    return sceneInstance;
  },
//  删除一个场景
  async deleteScene(docId, sceneId){
    let document  = await Document.findById(docId);
    document.scenes.id(sceneId).remove();
    await document.save();
  },
//  获取场景详情
  async getScene(docId, sceneId){
    let document  = await Document.findById(docId);
    let scene = document.scenes.id(sceneId);
    return {doc:document, scene};
  },
//  修改场景
  async updateScene(id, sceneId, sceneParam){
    let param = {};
    Object.keys(sceneParam).forEach(key=>{
      param['scenes.$.' + key] = sceneParam[key];
    });
    return await Document.updateOne({_id:id, 'scenes._id':sceneId},{
      $set:param,
      $currentDate:{updateTime:true}
    })
  },
//  创建线索
  async createClueInScene(docId, sceneId, clue){
    let doc = await Document.findById(docId);
    let scene = await doc.scenes.id(sceneId);
    let clueInstance = await scene.clues.create(clue);
    scene.clues.push(clueInstance);
    doc.updateTime = new Date();
    await doc.save();
    return {doc, clueInstance};
  },
//  删除一个线索
  async deleteClue(docId, sceneId, clueId){
    let document  = await Document.findById(docId);
    let scene = document.scenes.id(sceneId);
    scene.clues.id(clueId).remove();
    await document.save();
  },
//  修改线索
  async updateClue(id, sceneId, clueId, sceneParam){
    let doc = await Document.findById(id);
    let scene = await doc.scenes.id(sceneId);
    let clue = scene.clues.id(clueId);
    Object.keys(sceneParam).forEach(key=>{
      clue[key] = sceneParam[key];
    });
    doc.updateTime = new Date();
    let result = await doc.save();
    return !!result;
  },
//  获取某个人的任务
  async getTaskForRole(docId, roleId){
    let doc  = await Document.findById(docId);
    let tasks = doc.toObject().tasks.filter(task=>task.belongToRoleId.toString() === roleId);
    return {doc, tasks};
  },
  //  获取某剧本全部的任务
  async getAllTasks(docId){
    let doc  = await Document.findById(docId);
    return doc.tasks;
  },
//  修改任务
  async updateTask(docId, taskId, taskParam){
    let param = {};
    Object.keys(taskParam).forEach(key=>{
      param['tasks.$.' + key] = taskParam[key];
    });
    return await Document.updateOne({_id:docId, 'tasks._id':taskId},{
      $set:param,
      $currentDate:{updateTime:true}
    })
  },
//  删除任务
  async deleteTask(docId, taskId){
    let doc  = await Document.findById(docId);
    doc.tasks.id(taskId).remove();
    await doc.save();
    return doc;
  },
//  创建结局片段
  async createEnding(docId, ending){
    let doc = await Document.findById(docId);
    let endingInstance = await doc.endings.create(ending);
    doc.endings.push(endingInstance);
    doc.updateTime = new Date();
    await doc.save();
    return {doc, endingInstance};
  },
//  获取结局
  async getEnding(docId, endingId){
    let doc  = await Document.findById(docId);
    let ending = doc.endings.id(endingId);
    return {doc, ending};
  },
  //  修改结局
  async updateEnding(docId, endingId, endingParam){
    let param = {};
    Object.keys(endingParam).forEach(key=>{
      param['endings.$.' + key] = endingParam[key];
    });
    console.log(param,endingParam)
    return await Document.updateOne({_id:docId, 'endings._id':endingId},{
      $set:param,
      $currentDate:{updateTime:true}
    })
  },


};

module.exports = dao;
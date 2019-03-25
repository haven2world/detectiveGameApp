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
  'scene',
  'task',
  'ending',
  'difficulty'
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
  async getDocumentSimpleInfo(id){
    let doc = await document.getDocumentById(id);
    //去除剧本等冗余信息 避免数据过大
    doc = doc.toObject();
    doc.stories = [];
    doc.tasks = [];
    doc.endings.forEach(ending=>{
      ending.content = '';
    });
    return doc;
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

//  创建新场景
  async createScene(docId, name){
    let sceneInstance = await document.createSceneInDocument(docId,{name,enableStage:1});
    return sceneInstance;
  },

//  删除场景
  async deleteScene(docId, sceneId){
    let result = await document.deleteScene(docId, sceneId);
    return !!result;
  },
//  获取某场景的详情
  async getSceneDetail(docId, sceneId){
    let {doc, scene} = await document.getScene(docId, sceneId);
    return {scene, storyStageCount:doc.storyStageCount};
  },
//  修改场景详情
  async modifyScene(docId, sceneId, param){
    const field = {
      name: true,
      enableStage: true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
    }
    await document.updateScene(docId, sceneId, paramToSet);
  },
  //  创建新线索
  async createClue(docId, sceneId){
    let {doc, clueInstance} = await document.createClueInScene(docId, sceneId, {name:'',content:'',enableStage:1,repeatable:false,needSkill:false,});
    await service.changeDocumentComposingStage(doc,'task');
    return clueInstance;
  },
  //  删除线索
  async deleteClue(docId, sceneId, clueId){
    let result = await document.deleteClue(docId, sceneId, clueId);
    return !!result;
  },
//  修改线索详情
  async modifyClue(docId, sceneId, clueId, param){
    const field = {
      name:true,
      content:true,
      enableStage:true,
      repeatable:true,
      contentForSkill:true,
      skillId:true,
      needSkill:true
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
      if(key === 'skillId'){
        let allSkills = await service.getSkills(docId);
        if(!allSkills.find(skill=>skill._id.toString()===param.skillId)){
          throw {code:_Exceptions.PARAM_ERROR,message:'未找到该技能'}
        }
      }
    }
    await document.updateClue(docId, sceneId, clueId, paramToSet);
  },
//获取某个人的全部任务
  async getOnesTasks(docId, roleId){
    let {doc, tasks} = await document.getTaskForRole(docId, roleId);
    let name = doc.roles.id(roleId).name;
    return {name, tasks};
  },
//创建一个task
  async createTask(docId, roleId){
    let {doc, taskInstance} = await document.createTask(docId, roleId);
    await service.changeDocumentComposingStage(doc,'ending');
    return taskInstance;
  },
//  修改任务详情
  async modifyTaskDetail(docId, taskId, param){
    const field = {
      content:true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
    }
    await document.updateTask(docId, taskId, paramToSet);
  },
//  删除任务
  async deleteTask(docId, taskId){
    let doc = await document.deleteTask(docId, taskId);
    doc.endings.forEach(ending=>{
      ending.conditionsTaskId = ending.conditionsTaskId.filter(task=>task!==taskId);
    });
    await doc.save();
    return true;
  },

//创建一个结局片段
  async createEndingWithName(docId, name){
    let {doc, endingInstance} = await document.createEnding(docId, {name});
    await service.changeDocumentComposingStage(doc,'difficulty');
    return endingInstance;
  },
//  获取结局片段
  async getEndingDetail(docId, endingId){
    let {doc, ending} = await document.getEnding(docId, endingId);
    //将角色信息和人物信息写入结局片段中
    doc = doc.toObject();
    ending = ending.toObject();
    let roleTaskMap = {};
    let taskMap = {};
    let roleMap = {};
    doc.tasks.forEach(task=>{
      if(!roleTaskMap[task.belongToRoleId]){
        roleTaskMap[task.belongToRoleId] = [];
      }
      roleTaskMap[task.belongToRoleId].push(task);
      taskMap[task._id] = task;
    });
    let roles = doc.roles.map(role=>{
      roleMap[role._id] = {
        _id:role._id,
        name:role.name,
      };
      return {
        _id:role._id,
        name:role.name,
        tasks:roleTaskMap[role._id]
      }
    });
    ending.roles = roles;
    ending.roleMap = roleMap;
    ending.taskMap = taskMap;
    return ending;
  },
  //  修改结局详情
  async modifyEndingDetail(docId, endingId, param){
    const field = {
      name:true,
      content:true,
      conditionsTaskId:true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
        if(key === 'conditionsTaskId'){
          let allTasks = await document.getAllTasks(docId);
          for(let i=0;i<param.conditionsTaskId.length;++i){
            if(!allTasks.find(task=>task._id.toString()===param.conditionsTaskId[i])){
              throw {code:_Exceptions.PARAM_ERROR,message:'未找到该任务'}
            }
          }
        }
      }
    }
    await document.updateEnding(docId, endingId, paramToSet);
  },
//  修改难度等级
  async modifyDifficultyDetail(docId, level, param){
    const field = {
      maxInquiryTimes:true,
      keepClueSecret:true,
    };

    let paramToSet = {};
    for(let key in param){
      if(field[key]){
        paramToSet[key] = param[key];
      }
    }
    await document.updateLevel(docId, level, paramToSet);
  },

};



module.exports = service;


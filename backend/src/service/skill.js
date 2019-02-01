'use strict';


/**
 * 技能相关服务
 */


const skill = require('../dao/skill');

const service = {
  //为一个文档创建技能
  async createSkillForDoc(name, docId){
    return await skill.createSkill(docId, name);
  },
  //修改一个技能的信息
  async modifySkill(skillId, param){
    let setParam = {};
    if(param.name !== undefined){
      setParam.name = param.name;
    }
    if(param.description !== undefined){
      setParam.description = param.description;
    }
    return await skill.updateSkillById(skillId, setParam);
  }
};

module.exports = service;

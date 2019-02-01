'use strict';


/**
 * 操作 skill model
 */

const Skill = require('../model/skill');

module.exports = {
//  查找一部剧本的所有技能
  async findSkillByDocId(docId){
    return await Skill.find({belongToDocId:docId})
  },
//  按名字查找某剧本的技能
  async findSkillByNameAndDocId(name, docId){
    return await Skill.findOne({name, belongToDocId:docId})
  },

//  创建技能
  async createSkill(docId, name){
    let skill = new Skill({belongToDocId:docId, name})
    return await skill.save()
  },
// 修改一个技能的信息
  async updateSkillById(skillId, param){
    return await Skill.updateOne({_id:skillId},{
      $set:param,
    })
  }


};
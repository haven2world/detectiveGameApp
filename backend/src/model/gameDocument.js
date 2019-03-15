'use strict';


/**
 * 剧本model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//技能
let skillSchema = new Schema({
  skillInfo:{type:Schema.Types.ObjectId, ref:'SkillInfo'},
  maxCount:Number
});

//角色
let roleSchema = new Schema({
  name:String,
  photo:String,
  description:String,
  skills:[skillSchema]
});

//故事
let storySchema = new Schema({
  stage:Number,
  content:String,
  belongToRoleId:Schema.Types.ObjectId,
});

//线索
let clueSchema = new Schema({
  name:String,
  content:String,
  enableStage:Number,
  repeatable:Boolean,
  contentForSkill:String,
  skillId:Schema.Types.ObjectId,
  needSkill:Boolean
});

//场景
let sceneSchema = new Schema({
  name:String,
  enableStage:Number,
  clues:[clueSchema]
});

//任务
let taskSchema = new Schema({
  content:String,
  belongToRoleId:Schema.Types.ObjectId,
});

//结局
let endingSchema = new Schema({
  content:String,
  conditionsTaskId:[Schema.Types.ObjectId]
});

//难度
let difficultyLevelSchema = new Schema({
  maxInquiryTimes:Number,
  keepClueSecret:Boolean
});

let schema = new Schema({
  name:String,
  description:String,
  roles:[roleSchema],
  stories:[storySchema],
  scenes:[sceneSchema],
  tasks:[taskSchema],
  endings:[endingSchema],
  isPrivate:Boolean,
  creator:Schema.Types.ObjectId,
  publishFlag:Boolean,
  composingStage:String,
  storyStageCount:Number,
  level:{
    easy:difficultyLevelSchema,
    normal:difficultyLevelSchema,
    hard:difficultyLevelSchema
  },
  updateTime:Date,
});

module.exports = mongoose.model('GameDocument',schema);
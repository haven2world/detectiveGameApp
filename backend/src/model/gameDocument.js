'use strict';


/**
 * 剧本modal
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//技能
let skillSchema = new Schema({
  name:String,
  description:String,
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
  content:[String],
  belongToRoleId:Schema.Types.ObjectId,
});

//线索
let clueSchema = new Schema({
  content:String,
  enableStage:Number,
  repeatable:Boolean,
  contentForSkill:String,
  SkillId:Schema.Types.ObjectId,
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
  level:{
    easy:difficultyLevelSchema,
    normal:difficultyLevelSchema,
    hard:difficultyLevelSchema
  }
});

module.exports = mongoose.model('GameDocument',schema);
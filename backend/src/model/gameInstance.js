'use strict';


/**
 * 一场游戏model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//技能
let skillSchema = new Schema({
  count:Number
});

//线索
let clueSchema = new Schema({
  clueDocumentId:Schema.Types.ObjectId,
  founder:Schema.Types.ObjectId,
  sillUser:Schema.Types.ObjectId,
  sceneId:Schema.Types.ObjectId,
  shared:Boolean,
});

//消息
let messageSchema = new Schema({
  content:String,
  responseFlag:Boolean,
  responseType:String,
  responseParam:Schema.Types.Mixed,
  readFlag:Boolean,
  hasResponse:Boolean
});

//难度
let difficultyLevelSchema = new Schema({
  maxInquiryTimes:Number,
  keepClueSecret:Boolean
});

//角色
let roleSchema = new Schema({
  roleDocumentId:Schema.Types.ObjectId,
  skillUse:[skillSchema],
  player:Schema.Types.ObjectId,
  clues:[clueSchema],
  messages:[messageSchema],
  finishedTask:Schema.Types.Mixed
});

let schema = new Schema({
  document:{type:Schema.Types.ObjectId, ref:'GameDocument'},
  players:[{type:Schema.Types.ObjectId, ref:'User'}],
  manager:Schema.Types.ObjectId,
  roles:[roleSchema],
  stage:Number,
  status:String,
  sentEnding:Boolean,
  difficultyLevel:difficultyLevelSchema,
  updateTime:Date,
});

module.exports = mongoose.model('GameInstance',schema);
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

let schema = new Schema({
  document:{type:Schema.Types.ObjectId, ref:'GameDocument'},
  players:[Schema.Types.ObjectId],
  manager:Schema.Types.ObjectId,
  roles:[{
    roleDocumentId:Schema.Types.ObjectId,
    skillUse:[skillSchema],
    player:Schema.Types.ObjectId,
    clues:[clueSchema],
    messages:[messageSchema]
  }],
  stage:Number,
  status:String,
  difficultyLevel:difficultyLevelSchema,
});

module.exports = mongoose.model('User',schema);
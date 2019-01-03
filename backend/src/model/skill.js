'use strict';


/**
 * 技能model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  name:String,
  description:String,
  belongToDocId:Schema.Types.ObjectId
});

module.exports = mongoose.model('SkillInfo',schema);
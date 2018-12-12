'use strict';


/**
 * 用户model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  loginId:{
    type:String,
    index: true,
    unique: true
  },
  passwordHash:String,
  salt:String,
  token:String
});

module.exports = mongoose.model('User',schema);
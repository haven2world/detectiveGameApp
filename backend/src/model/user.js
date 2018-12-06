'use strict';


/**
 * 用户model
 */
const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  loginId:{
    type:String,
    index: true,
    unique: true
  },
  passwordHash:String,
  salt:String,
});

module.exports = mongoose.model('User',schema);
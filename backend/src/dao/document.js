'use strict';


/**
 * 操作 document model
 */

const Document = require('../model/gameDocument');

module.exports = {
//  查找一个用户创建的剧本
  async queryDocumentsForCreator(userId){
    return await Document.find({creator:userId})
  },
//  创建一个剧本
  async createDocument(prop){
    let document = new Document(prop);
    return await document.save();
  }





};
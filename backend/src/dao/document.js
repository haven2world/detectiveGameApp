'use strict';


/**
 * 操作 document model
 */

const Document = require('../model/gameDocument');

module.exports = {
//  查找一个用户创建的剧本列表
  async queryDocumentsForCreator(userId){
    return await Document.find({creator:userId}, {name:1, description:1, publishFlag:1, roles:1, updateTime:1})
  },
//  创建一个剧本
  async createDocument(prop){
    let document = new Document(prop);
    return await document.save();
  },
//获取一个剧本详情
  async getDocumentById(id){
    return await Document.findById(id)
  },
//修改剧本基础信息
  async updateBasicInfo(id, param){
    return await Document.updateOne({_id:id},{
      $set:param,
      $currentDate:{updateTime:true}
    });
  }



};
'use strict';


/**
 * 剧本相关接口
 */

const Router = require('koa-router');
const documentService = require('../service/gameDocument');

let router = new Router();

//获取剧本列表
router.get('/',async(ctx, next)=>{
  ctx._data.documents = await documentService.getDocumentsForCreator(ctx._userId);
})

//创建剧本
router.post('/',async(ctx, next)=>{
  const {name} = ctx.request.body;
  if(!name){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'请提供剧本名称'
    })
  }
  await documentService.createDocumentWithNameAndUser(name, ctx._userId);
})
module.exports = router;



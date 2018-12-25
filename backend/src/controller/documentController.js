'use strict';

/**
 * 剧本相关接口
 */

const Router = require('koa-router');
const documentService = require('../service/gameDocument');
const fileService = require('../service/fileService');
const commonUtils = require('../utils/commonUtils');


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

//获取剧本详情
router.get('/:id',async(ctx, next)=>{
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.document = await documentService.getDocumentDetail(ctx.params.id);
})

//修改剧本基础内容
router.put('/:id',async(ctx, next)=>{
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  await documentService.modifyBasicInfo(ctx.params.id, ctx.request.body);
})

//创建剧本角色
router.post('/:id/roles',async(ctx, next)=>{
  const {name} = ctx.request.body;
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!name){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'请输入角色名称'
    })
  }
  ctx.body.data = await documentService.createRole(ctx.params.id, name);
})

//获取角色详情
router.get('/:id/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  let document  = await documentService.getDocumentDetail(ctx.params.id);
  ctx._data.role = document.roles.id(ctx.params.roleId);

})

//删除一个角色
router.delete('/:id/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  let document  = await documentService.getDocumentDetail(ctx.params.id);
  document.roles.id(ctx.params.roleId).remove();
  await document.save();
})

//上传角色头像
router.post('/:id/roles/:roleId/avatar',async(ctx, next)=>{
  const {file} = ctx.request.files;
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!file){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'请上传有效的图片'
    })
  }

  console.log(file)
  let fileName = commonUtils.GenID()+ '_' + file.name;
  let path = _Config.path.avatar + '/' + fileName;

  let result = await fileService.saveFile(path, file.path);
  console.log(result)

})

module.exports = router;



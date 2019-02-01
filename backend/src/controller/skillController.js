'use strict';


/**
 * 技能相关接口
 */

const Router = require('koa-router');
const documentService = require('../service/gameDocument');
const skillService = require('../service/skill');


let router = new Router();


//创建技能
router.post('/',async(ctx, next)=>{
  const {name, roleId, docId} = ctx.request.body;
  if(!name){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'请提供技能名称'
    })
  }
  if(!roleId || !docId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  ctx._data.skill = await documentService.addSkillForRole(name, docId, roleId);
});

//修改技能
router.put('/:skillId',async(ctx, next)=>{
  const {name, description, count, roleId, docId} = ctx.request.body;
  if(!roleId || !docId|| !ctx.params.skillId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  if(name || description){
    await skillService.modifySkill(ctx.params.skillId, {name,description});
  }

  if(count){
    await documentService.modifySkillCount(docId, roleId, ctx.params.skillId, count);
  }
});

//删除技能
router.put('/:skillId',async(ctx, next)=>{
  const {roleId, docId} = ctx.request.body;
  if(!roleId || !docId|| !ctx.params.skillId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }



});

module.exports = router;
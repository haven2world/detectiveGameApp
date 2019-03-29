'use strict';


/**
 * 房主相关接口
 */

const Router = require('koa-router');
const documentService = require('../service/gameDocument');


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


module.exports = router;
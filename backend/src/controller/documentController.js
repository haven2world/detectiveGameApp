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

//获取剧本详情
router.get('/:id',async(ctx, next)=>{
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.document = await documentService.getDocumentSimpleInfo(ctx.params.id);
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

  ctx._data.role = await documentService.getRole(ctx.params.id, ctx.params.roleId);
  ctx._data.skills = await documentService.getSkills(ctx.params.id);
})

//删除一个角色
router.delete('/:id/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  await documentService.deleteRole(ctx.params.id, ctx.params.roleId);
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

  ctx._data.photo = await documentService.modifyRoleAvatar(ctx.params.id, ctx.params.roleId, file);

})

//修改角色信息
router.put('/:id/roles/:roleId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  await documentService.modifyRoleInfo(ctx.params.id, ctx.params.roleId, ctx.request.body);
})

//删除某个角色的某个技能
router.delete('/:id/roles/:roleId/skills/:roleSkillId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId || !ctx.params.roleSkillId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  await documentService.deleteSkillForRole(ctx.params.id, ctx.params.roleId, ctx.params.roleSkillId);
})

//创建新阶段
router.post('/:id/stages',async(ctx, next)=>{
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.storyStageCount = await documentService.addStoryStage(ctx.params.id);
})

//删除最后一个阶段
router.delete('/:id/stages',async(ctx, next)=>{
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.storyStageCount = await documentService.reduceStoryStage(ctx.params.id);
})

//获取某一阶段的故事列表
router.get('/:id/stages/:stageCount',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.stageCount){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }

  ctx._data.stories = await documentService.getAllRolesStoriesInStage(ctx.params.id, ctx.params.stageCount);
})

//创建故事
router.post('/:id/stories',async(ctx, next)=>{
  const {roleId, stageCount, content} = ctx.request.body;
  if(!ctx.params.id || !roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(typeof stageCount !== "number"){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效阶段'
    })
  }
  if(!content){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效故事内容'
    })
  }
  ctx._data.story = await documentService.createStory(ctx.params.id, roleId, stageCount, content);
})

//修改故事
router.put('/:id/stories/:storyId',async(ctx, next)=>{
  const {content} = ctx.request.body;
  if(!ctx.params.id || !ctx.params.storyId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!content){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效故事内容'
    })
  }
  await documentService.modifyStory(ctx.params.id, ctx.params.storyId, content);
})

//创建场景
router.post('/:id/scenes',async(ctx, next)=>{
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
      message:'缺少场景名称'
    })
  }
  ctx._data.scene = await documentService.createScene(ctx.params.id, name);
})

//删除场景
router.delete('/:id/scenes/:sceneId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.sceneId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  await documentService.deleteScene(ctx.params.id, ctx.params.sceneId);
})

//获取场景详情
router.get('/:id/scenes/:sceneId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.sceneId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  let {storyStageCount, scene} = await documentService.getSceneDetail(ctx.params.id, ctx.params.sceneId);
  ctx._data.scene = scene;
  ctx._data.storyStageCount = storyStageCount;
  ctx._data.allSkills = await documentService.getSkills(ctx.params.id);
})

//修改场景详情
router.put('/:id/scenes/:sceneId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.sceneId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.scene = await documentService.modifyScene(ctx.params.id, ctx.params.sceneId, ctx.request.body);
})

//创建线索
router.post('/:id/scenes/:sceneId/clues',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.sceneId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.clue = await documentService.createClue(ctx.params.id, ctx.params.sceneId);
})

//删除线索
router.delete('/:id/scenes/:sceneId/clues/:clueId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.sceneId || !ctx.params.clueId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.clue = await documentService.deleteClue(ctx.params.id, ctx.params.sceneId, ctx.params.clueId);
})

//修改线索
router.put('/:id/scenes/:sceneId/clues/:clueId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.sceneId || !ctx.params.clueId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.clue = await documentService.modifyClue(ctx.params.id, ctx.params.sceneId, ctx.params.clueId, ctx.request.body);
})

//获取任务详情
router.get('/:id/roles/:roleId/tasks',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  let {name, tasks} = await documentService.getOnesTasks(ctx.params.id, ctx.params.roleId);
  ctx._data.tasks  = tasks;
  ctx._data.roleName = name;
})

//创建任务
router.post('/:id/roles/:roleId/tasks',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.roleId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.task  = await documentService.createTask(ctx.params.id, ctx.params.roleId);
})

//修改任务
router.put('/:id/tasks/:taskId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.taskId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.task  = await documentService.modifyTaskDetail(ctx.params.id, ctx.params.taskId, ctx.request.body);
})


//删除任务
router.delete('/:id/tasks/:taskId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.taskId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.task  = await documentService.deleteTask(ctx.params.id, ctx.params.taskId);
})

//创建结局
router.post('/:id/endings',async(ctx, next)=>{
  let {name} = ctx.request.body;
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!name){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'结局片段需要一个名字'
    })
  }
  ctx._data.ending  = await documentService.createEndingWithName(ctx.params.id, name);
})

//获取结局片段
router.get('/:id/endings/:endingId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.endingId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.ending  = await documentService.getEndingDetail(ctx.params.id, ctx.params.endingId);
})

//修改结局片段
router.put('/:id/endings/:endingId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.endingId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.ending  = await documentService.modifyEndingDetail(ctx.params.id, ctx.params.endingId, ctx.request.body);
})

//创建结局条件
router.post('/:id/endings/:endingId/tasks/:taskId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.endingId || !ctx.params.taskId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  ctx._data.condition  = await documentService.createEndingCondition(ctx.params.id, ctx.params.endingId, ctx.params.taskId);
})

//删除结局条件
router.delete('/:id/endings/:endingId/conditions/:conditionId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.endingId || !ctx.params.conditionId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  await documentService.deleteEndingCondition(ctx.params.id, ctx.params.endingId, ctx.params.conditionId);
})

//修改结局条件
router.put('/:id/endings/:endingId/conditions/:conditionId',async(ctx, next)=>{
  if(!ctx.params.id || !ctx.params.endingId || !ctx.params.conditionId){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  await documentService.modifyEndingCondition(ctx.params.id, ctx.params.endingId, ctx.params.conditionId, ctx.request.body);
})

//修改难度设置
router.put('/:id/difficulty',async(ctx, next)=>{
  let {level} = ctx.request.body;
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  if(!level){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'需要一个有效的难度等级'
    })
  }
  ctx._data.difficulty  = await documentService.modifyDifficultyDetail(ctx.params.id, level, ctx.request.body);
})

//发布剧本
router.put('/:id/publish',async(ctx, next)=>{
  if(!ctx.params.id){
    ctx.throw({
      code:_Exceptions.PARAM_ERROR,
      message:'无有效ID'
    })
  }
  await documentService.toPublishDocument(ctx.params.id);
})
module.exports = router;



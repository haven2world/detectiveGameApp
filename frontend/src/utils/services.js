'use strict'

import http from './http';

/**
 * 所有的请求都写在这里
 */


/* 注册用户
 - url: /detective/apis/pub/users/accounts
 - method: post
 - param:{
 loginId
 password
 }
 */

export function signUp(param){
  let url = '/detective/apis/pub/users/accounts';
  return http.post(url, param);
}

/* 获取匿名账户
 - url: /detective/apis/pub/users/anonymousAccounts
 - method: post
 - param:{
 }
 */

export function anonymousSignUp(){
  let url = '/detective/apis/pub/users/anonymousAccounts';
  return http.post(url, {});
}


/* 检查登录
 - url: /detective/apis/auth/users/verify-token
 - method: get
 - param:{
 }
 */

export function verifyToken(param){
  let url = '/detective/apis/auth/users/verify-token';
  return http.get(url, param);
}

/* 登录
 - url: /detective/apis/pub/users/signIn
 - method: post
 - param:{
 loginId
 password
 }
 */

export function signIn(param){
  let url = '/detective/apis/pub/users/signIn';
  return http.post(url, param);
}

/* 获取剧本列表
 - url: /detective/apis/auth/documents
 - method: get
 - param:{
 }
 */

export function fetchGameDocuments(){
  let url = '/detective/apis/auth/documents';
  return http.get(url, {});
}

/* 创建剧本
 - url: /detective/apis/auth/documents
 - method: post
 - param:{
 name
 }
 */

export function createDocument(param){
  let url = '/detective/apis/auth/documents';
  return http.post(url, param);
}

/* 获取剧本详情
 - url: /detective/apis/auth/documents/:id
 - method: get
 - param:{
 }
 */

export function fetchDocumentDetail(id){
  let url = '/detective/apis/auth/documents/' + id;
  return http.get(url, {});
}

/* 修改剧本详情
 - url: /detective/apis/auth/documents/:id
 - method: put
 - param:{
 name
 description
 publishFlag
 composingStage
 level{
  easy {maxInquiryTimes, keepClueSecret}
  normal
  hard
 }
 }
 */

export function modifyDocumentDetail(id, params){
  let url = '/detective/apis/auth/documents/' + id;
  return http.put(url, params);
}

/* 创建角色
 - url: /detective/apis/auth/documents/:id/roles
 - method: post
 - param:{
 name
 }
 */

export function createRole(id, param){
  let url = '/detective/apis/auth/documents/' + id +'/roles';
  return http.post(url, param);
}

/* 获取角色详情
 - url: /detective/apis/auth/documents/:id/roles/:roleId
 - method: get
 - param:{
 }
 */

export function fetchRoleDocument(id, roleId){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId ;
  return http.get(url, {});
}

/* 删除一个角色
 - url: /detective/apis/auth/documents/:id/roles/:roleId
 - method: delete
 - param:{
 }
 */

export function deleteRoleDocument(id, roleId){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId ;
  return http.delete(url, {});
}

/* 上传角色头像
 - url: /detective/apis/auth/documents/:id/roles/:roleId/avatar
 - method: upload
 - param:{
 file
 }
 */

export function uploadRoleAvatar(id, roleId, param){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId + '/avatar';
  return http.upload(url, param);
}

/* 修改角色信息
 - url: /detective/apis/auth/documents/:id/roles/:roleId
 - method: put
 - param:{
 name
 description
 }
 */

export function modifyRoleInfo(id, roleId, param){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId ;
  return http.put(url, param);
}

/* 创建技能
 - url: /detective/apis/auth/skills
 - method: post
 - param:{
  name
  docId
  roleId
 }
 */

export function createSkill(param){
  let url = '/detective/apis/auth/skills';
  return http.post(url, param);
}

/* 修改技能
 - url: /detective/apis/auth/skills/:skillId
 - method: put
 - param:{
  name
  description
  count
  docId
  roleId
 }
 */

export function modifySkill(skillId, param){
  let url = '/detective/apis/auth/skills/' + skillId;
  return http.put(url, param);
}

/* 删除技能
 - url: /detective/apis/auth/documents/:id/roles/:roleId/skills/:roleSkillId
 - method: delete
 - param:{
 }
 */

export function deleteSkill(id, roleId, roleSkillId){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId + '/skills/' + roleSkillId;
  return http.delete(url, {});
}

/* 创建故事阶段
 - url: /detective/apis/auth/documents/:id/stages
 - method: post
 - param:{
 }
 */

export function createStoryStage(id){
  let url = '/detective/apis/auth/documents/' + id +'/stages';
  return http.post(url, {});
}

/* 获取当前阶段的故事
 - url: /detective/apis/auth/documents/:id/stages/:stageCount
 - method: get
 - param:{
 }
 */

export function fetchStoriesInStage(id, stageCount){
  let url = '/detective/apis/auth/documents/' + id +'/stages/' + stageCount;
  return http.get(url, {});
}

/* 删除技能
 - url: /detective/apis/auth/documents/:id/stages
 - method: delete
 - param:{
 }
 */

export function deleteLastStage(id){
  let url = '/detective/apis/auth/documents/' + id + '/stages';
  return http.delete(url, {});
}

/* 创建故事
 - url: /detective/apis/auth/documents/:id/stories
 - method: post
 - param:{
  roleId,
  stageCount,
  content
 }
 */

export function createStory(id, param){
  let url = '/detective/apis/auth/documents/' + id +'/stories';
  return http.post(url, param);
}


/* 修改故事
 - url: /detective/apis/auth/documents/:id/stories/:storyId
 - method: put
 - param:{
  content
 }
 */

export function modifyStory(id, storyId, param){
  let url = '/detective/apis/auth/documents/' + id +'/stories/' + storyId;
  return http.put(url, param);
}

/* 创建场景
 - url: /detective/apis/auth/documents/:id/scenes
 - method: post
 - param:{
  name
 }
 */

export function createScene(id, param){
  let url = '/detective/apis/auth/documents/' + id +'/scenes';
  return http.post(url, param);
}

/* 获取场景详情
 - url: /detective/apis/auth/documents/:id/scenes/:sceneId
 - method: get
 - param:{
 }
 */

export function fetchSceneDetail(id, sceneId){
  let url = '/detective/apis/auth/documents/' + id +'/scenes/' + sceneId;
  return http.get(url, {});
}

/* 删除场景
 - url: /detective/apis/auth/documents/:id/scenes/:sceneId
 - method: delete
 - param:{
 }
 */

export function deleteSceneDocument(docId, sceneId){
  let url = '/detective/apis/auth/documents/' + docId + '/scenes/' + sceneId;
  return http.delete(url, {});
}


/* 修改场景
 - url: /detective/apis/auth/documents/:id/scenes/:sceneId
 - method: put
 - param:{
 name
 enableStage
 }
 */

export function modifySceneInfo(docId, sceneId, param){
  let url = '/detective/apis/auth/documents/' + docId + '/scenes/' + sceneId;
  return http.put(url, param);
}

/* 创建线索
 - url: /detective/apis/auth/documents/:id/scenes/:sceneId/clues
 - method: post
 - param:{
 }
 */

export function createClue(id, sceneId){
  let url = '/detective/apis/auth/documents/' + id +'/scenes/' + sceneId + '/clues';
  return http.post(url, {});
}

/* 修改线索
 - url: /detective/apis/auth/documents/:id/scenes/:sceneId/clues/:clueId
 - method: put
 - param:{
  name:String,
  content:String,
  enableStage:Number,
  repeatable:Boolean,
  contentForSkill:String,
  skillId:ObjectId,
  needSkill:Boolean
 }
 */

export function modifyClueInfo(docId, sceneId, clueId, param){
  let url = '/detective/apis/auth/documents/' + docId + '/scenes/' + sceneId + '/clues/' + clueId;
  return http.put(url, param);
}

/* 删除线索
 - url: /detective/apis/auth/documents/:id/scenes/:sceneId/clues/:clueId
 - method: delete
 - param:{
 }
 */

export function deleteClue(docId, sceneId, clueId){
  let url = '/detective/apis/auth/documents/' + docId + '/scenes/' + sceneId + '/clues/' + clueId;
  return http.delete(url, {});
}

/* 获取任务列表
 - url: /detective/apis/auth/documents/:id/roles/:roleId/tasks
 - method: get
 - param:{
 }
 */

export function fetchTaskList(id, roleId){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId + '/tasks';
  return http.get(url, {});
}

/* 创建任务
 - url: /detective/apis/auth/documents/:id/roles/:roleId/tasks
 - method: post
 - param:{
 }
 */

export function createTask(id, roleId){
  let url = '/detective/apis/auth/documents/' + id +'/roles/' + roleId + '/tasks';
  return http.post(url, {});
}

/* 修改任务
 - url: /detective/apis/auth/documents/:id/tasks/:taskId
 - method: put
 - param:{
  content
 }
 */

export function modifyTaskInfo(id, taskId, param){
  let url = '/detective/apis/auth/documents/' + id + '/tasks/' + taskId;
  return http.put(url, param);
}

/* 删除任务
 - url: /detective/apis/auth/documents/:id/tasks/:taskId
 - method: delete
 - param:{
 }
 */

export function deleteTask(id, taskId){
  let url = '/detective/apis/auth/documents/' + id + '/tasks/' + taskId;
  return http.delete(url, {});
}

/* 创建结局
 - url: /detective/apis/auth/documents/:id/endings
 - method: post
 - param:{
 }
 */

export function createEnding(id, param){
  let url = '/detective/apis/auth/documents/' + id + '/endings';
  return http.post(url, param);
}

/* 获取结局
 - url: /detective/apis/auth/documents/:id/endings/:endingId
 - method: get
 - param:{
 }
 */

export function fetchEnding(id, endingId){
  let url = '/detective/apis/auth/documents/' + id + '/endings/' + endingId;
  return http.get(url, {});
}


/* 修改结局
 - url: /detective/apis/auth/documents/:id/endings/:endingId
 - method: put
 - param:{
 name
 content
 conditionsTaskId
 }
 */

export function modifyEnding(id, endingId, param){
  let url = '/detective/apis/auth/documents/' + id + '/endings/' + endingId;
  return http.put(url, param);
}

/* 修改难度设置
 - url: /detective/apis/auth/documents/:id/difficulty
 - method: put
 - param:{
 level
 maxInquiryTimes
 keepClueSecret
 }
 */

export function modifyDocumentLevelDetail(id, param){
  let url = '/detective/apis/auth/documents/' + id + '/difficulty' ;
  return http.put(url, param);
}


/* 发布
 - url: /detective/apis/auth/documents/:id/publish
 - method: put
 - param:{
 }
 */

export function publishDocument(id){
  let url = '/detective/apis/auth/documents/' + id + '/publish' ;
  return http.put(url, {});
}

/* 创建新的游戏房间
 - url: /detective/apis/auth/games
 - method: post
 - param:{
  docId
  level
 }
 */

export function createGameInstance(param){
  let url = '/detective/apis/auth/games';
  return http.post(url, param);
}

/* 获取历史游戏
 - url: /detective/apis/auth/games
 - method: get
 - param:{
 }
 */

export function fetchHistoryGames(){
  let url = '/detective/apis/auth/games';
  return http.get(url, {});
}

/* 获取游戏详情
 - url: /detective/apis/auth/games/:gameId
 - method: get
 - param:{
 }
 */

export function fetchGameDetail(gameId){
  let url = '/detective/apis/auth/games/' + gameId;
  return http.get(url, {});
}


/* 修改游戏状态
 - url: /detective/apis/auth/games/:gameId
 - method: put
 - param:{
 action
 status
 }
 */

export function changeGameStatus(gameId, param){
  let url = '/detective/apis/auth/games/' + gameId;
  return http.put(url, param);
}

/* 获取进行中的游戏
 - url: /detective/apis/auth/games/playingGames
 - method: get
 - param:{
 }
 */

export function fetchPlayingGame(){
  let url = '/detective/apis/auth/games/playingGames';
  return http.get(url, {});
}


/* 获取游戏中的角色状态概览
 - url: /detective/apis/auth/games/:gameId/roles/:roleId
 - method: get
 - param:{
 }
 */

export function fetchPlayingRoleDetail(gameId, roleId){
  let url = '/detective/apis/auth/games/' + gameId + '/roles/' + roleId;
  return http.get(url, {});
}

/* 修改任务完成状况
 - url: /detective/apis/auth/games/:gameId/roles/:roleId/tasks/:taskId
 - method: put
 - param:{
 finished
 }
 */

export function changeTaskStatus(gameId, roleId, taskId, param){
  let url = '/detective/apis/auth/games/' + gameId + '/roles/' + roleId + '/tasks/' + taskId;
  return http.put(url, param);
}

/* 获取游戏中的场景状态概览
 - url: /detective/apis/auth/games/:gameId/scenes/:sceneId
 - method: get
 - param:{
 }
 */

export function fetchPlayingSceneDetail(gameId, sceneId){
  let url = '/detective/apis/auth/games/' + gameId + '/scenes/' + sceneId;
  return http.get(url, {});
}

/* 建立游戏 websocket
 - url: /detective/ws/auth/gamers
 - method: ws
 - param:{
 }
 */

export function establishWSForGamer(){
  let url = '/detective/ws/auth/gamers';
  return http.ws(url);
}

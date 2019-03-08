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
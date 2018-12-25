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


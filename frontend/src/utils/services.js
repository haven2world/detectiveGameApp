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




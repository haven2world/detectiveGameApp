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


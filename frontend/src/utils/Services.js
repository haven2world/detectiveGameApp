'use strict'

import http from './http';

/**
 * 所有的请求都写在这里
 */


/* 西山课堂--评论点赞
 - url: /classroom/apis/auth/comments/{cId}/like
 - method: post
 - param:{
 }
 */

export function likedAComment(id){
  let url = '/classroom/apis/auth/comments/' + id + '/like';
  return http.post(url,{});
}


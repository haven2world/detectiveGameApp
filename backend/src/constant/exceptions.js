'use strict';


/**
 * 错误码
 */

module.exports = {
  UNKNOWN_ERROR:500,

//  参数错误
  PARAM_ERROR:501,

//  token失效
  TOKEN_ERROR:401,

//  未知的请求
  NOT_FOUND_ERROR:404,

//  数据库操作失败
  DB_ERROR:1000,

//  数据校验出错
  VALIDATE_ERROR:1001,

//  业务错误
  NORMAL_ERROR:900,

}
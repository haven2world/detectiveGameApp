'use strict';
import { Toast } from 'antd-mobile';

/**
 * 封装toast
 */

export const toast = {
  success(content){Toast.success(content,undefined,undefined,false)},
  fail(content){Toast.fail(content,undefined,undefined,false)},
  info(content){Toast.info(content,undefined,undefined,false)},
}
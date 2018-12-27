'use strict';
import { Toast } from 'antd-mobile/lib/index';

/**
 * 封装toast
 */
const toastConfig = [undefined,undefined,false];

export const toast = {
  success(content){Toast.success(content,...toastConfig)},
  fail(content){Toast.fail(content,...toastConfig)},
  info(content){Toast.info(content,...toastConfig)},
}
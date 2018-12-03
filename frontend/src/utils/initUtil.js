'use strict';
import classnames from 'classnames';
import EventEmitter from 'events';
import {Toast} from 'antd-mobile';

/**
 * 初始化工作
 */

const init = ()=>{
  //初始化全局变量
  window.classnames = classnames;
  window.eventBus = new EventEmitter();
  window.toast = Toast;

}

export default init;
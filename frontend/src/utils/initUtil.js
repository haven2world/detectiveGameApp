'use strict';
import classnames from 'classnames';
import EventEmitter from 'events';

/**
 * 初始化工作
 */

const init = ()=>{
  //初始化全局变量
  window.classnames = classnames;
  window.eventBus = new EventEmitter();
}

export default init;
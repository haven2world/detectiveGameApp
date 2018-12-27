'use strict';
import { Toast } from 'antd-mobile';

/**
 * 封装toast
 */

export const toast = {
  success(content){Toast.success(content,undefined,undefined,false)},
  fail(content){Toast.fail(content,undefined,undefined,false)},
  info(content){Toast.info(content,undefined,undefined,false)},
  light:(()=>{
    let lastToast;
    return (content)=> {
      if(lastToast){
        lastToast.remove();
      }
      let toast = document.createElement('div');
      let tip = document.createTextNode(content)
      toast.className = 'my-light-toast';
      toast.appendChild(tip);
      document.body.appendChild(toast);
      lastToast = toast;
    }
  })()
}
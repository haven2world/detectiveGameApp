'use strict';

import { useState, useEffect } from 'react';

import _useComponentPosition from './useComponentPosition';

/**
 * react 相关的hook
 */

export const useComponentPosition = _useComponentPosition;


//在body上创建一个div
export function useBodyNode() {
  const [node, setNode] = useState(null);

  useEffect(()=>{
    let div = document.createElement('div');
    setNode(div);
    document.body.appendChild(div);

    return ()=>{
      document.body.removeChild(div)
    }
  },[]);

  return node;
}

//为input提供一系列自动保存的方法
export function useInputAutoSave(onSave, defaultValue) {
  if(!onSave){
    throw {message:'invalid onSave function'};
  }
  const [value, setValue] = useState(defaultValue||'');
  const [timer, setTimer] = useState(null);

  useEffect(()=>{
    return ()=>{
      timer&&clearTimeout(timer);
    }
  },[]);

  function handleChangeValue(str){
    timer&&clearTimeout(timer);
    setValue(str);
    if(str){
      setTimer(setTimeout(()=>{
        onSave(str);
      },3000));
    }
  }

  return {
    defaultValue,
    onChange: handleChangeValue,
    onBlur: onSave,
    onVirtualKeyboardConfirm: onSave,
    current:value
  };
}

//在sessionStorage中记录tab
export function useTab(initialPage, key) {
  let initTab = Number(sessionStorage['_tabSaver-' + key]);
  if(initTab === undefined){
    initTab = initialPage;
    sessionStorage['_tabSaver-' + key] = initTab;
  }

  let [tab, setTab] = useState(initTab);

  let beforeSet = (value)=>{
    sessionStorage['_tabSaver-' + key] = value;
    setTab(value);
  };

  return [tab, beforeSet];
}
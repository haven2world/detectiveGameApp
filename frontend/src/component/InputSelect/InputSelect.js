'use strict';
import { useState, useEffect, useRef } from 'react';
import styles from './style.css';
import classNames from 'classnames';
import { useComponentPosition } from '@/utils/hookUtils';
import InputSelectList from './InputSelectList';
import { RenderIf } from '@/utils/commonUtils';

/**
 * 可输入可选择组件
 */

export default function({onChange, defaultValue='',list=[]}) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  //获取input的位置信息
  const inputRef = useRef(null);
  const inputPosition = useComponentPosition(inputRef);

  useEffect(()=>{
    let timer = setTimeout(()=>{
      inputRef.current.focus();
    },300);

    return ()=>clearTimeout(timer);
  },[]);

  function onChangeText(temp) {
    setValue(temp);
    onChange&&onChange(temp);
  }

  function delayToBlur() {
    setTimeout(()=>{
      setFocused(false);
    },0);
  }


  return (
    <div style={{width:'100%',position:'relative'}}>
      <input
        ref={inputRef}
        className={styles.input}
        value={value}
        onFocus={()=>{setFocused(true)}}
        onBlur={delayToBlur}
        onChange={event=>onChangeText(event.currentTarget.value)}
      />
      {RenderIf(focused && inputPosition)(
        <InputSelectList
          list={list}
          position={inputPosition}
          value={value}
          onChange={onChangeText}
        />
      )}
    </div>
  )
}
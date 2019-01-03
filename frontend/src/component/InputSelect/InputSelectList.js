'use strict';

import { useState, useEffect, useRef } from 'react';
import {createPortal} from 'react-dom';
import classNames from 'classnames';
import { useBodyNode } from '@/utils/hookUtils';
import styles from './style.css';

/**
 * 可输入可选择组件的下拉列表
 */

export default function InputSelectList({position, list, value, onChange}) {

  const node = useBodyNode();


  function renderItems() {
    let resultList = list.filter(item=>item.indexOf(value)>=0);
    if(resultList.length>0){
      return resultList.map((item,index)=>{
        return <div className={classNames(styles.listItem,'clickable')} key={index} onClick={()=>onChange(item)}>
          {item}
        </div>
      })
    }else{
      return <div className={classNames(styles.listItem,'gray-text')}>
        无结果
      </div>
    }
  }

  function getPositionStyle() {
    let x = position.left+document.documentElement.scrollLeft;
    let y = position.top+document.documentElement.scrollTop;

    return {
      width:position.width-2,
      left:x,
      top:y+position.height
    }
  }


  if(node){
    return createPortal(
      <div className={styles.listWrapper} style={getPositionStyle()}>
        {renderItems()}
      </div>,
      node
    );
  }else{
    return null
  }
}
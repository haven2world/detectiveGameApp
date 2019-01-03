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

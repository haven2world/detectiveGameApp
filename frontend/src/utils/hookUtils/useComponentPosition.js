'use strict';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';

/**
 * 获取元素的位置
 */



export default function(ref) {
  const [position, setPosition] = useState(getPositionInfo(ref.current));

  function getPositionInfo(ele){
    if(ele){
      return (ele.getBoundingClientRect())
    }
  }

  function handleChange(){
    let info = getPositionInfo(ref.current);
    setPosition(info);
  }
  useLayoutEffect(()=>{
    handleChange();
    window.addEventListener("resize", handleChange);
    window.addEventListener("scroll", handleChange);
    let resizeObserver = new ResizeObserver(() => handleChange());
    resizeObserver.observe(ref.current);

    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("scroll", handleChange);
      resizeObserver.disconnect(ref.current);
      resizeObserver = null;
      setPosition(null);
    };
  },[]);

  return position;
};
'use strict';


/**
 * 剧本列表
 */

import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal} from 'antd-mobile';
import { Toast } from 'antd-mobile/lib/index';
import router from 'umi/router';

const {Item} = List;

export default function(props) {
  const {list} = props;

  //点击行
  function editDocument(document) {

  }
  return (
    <List >
      {list.map((document, index)=>{
        return <Item key={index} wrap onClick={()=>editDocument(document)} arrow={'horizontal'}
                     extra={!document.publishFlag?'未完成':null} error
        >
          {document.name}
          <Item.Brief>{document.description||'暂无描述'}</Item.Brief>
        </Item>
      })}
    </List>
  )
};
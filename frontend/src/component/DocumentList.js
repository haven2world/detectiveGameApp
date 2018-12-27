'use strict';
import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal} from 'antd-mobile';
import router from 'umi/router';
import DefaultPage from '@/component/DefaultPage';
import LoadingPage from '@/component/LoadingPage';

/**
 * 剧本列表
 */


const {Item} = List;

export default function(props) {
  const {list, loading} = props;


  //点击行
  function editDocument(document) {
    router.push('/documents/' + document._id);
  }
  if(loading){
    return <LoadingPage/>
  }
  if(list.length>0){
    return (
      <List >
        {list.map((document, index)=>{
          return <Item key={index} wrap onClick={()=>editDocument(document)} arrow={'horizontal'}
                       extra={!document.publishFlag?'未完成':null} error
          >
            {document.name}
            <Item.Brief>剧本角色人数：{document.roleCount}<br/>
              {document.description||'暂无描述'}</Item.Brief>
          </Item>
        })}
      </List>
    )
  }else{
    return (
      <DefaultPage
        content={'去创作一个新的剧本吧'}
      />
    )
  }
};
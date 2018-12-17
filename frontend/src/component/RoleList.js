'use strict';
import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal} from 'antd-mobile';
import { Toast } from 'antd-mobile/lib/index';
import router from 'umi/router';
import DefaultPage from '@/component/DefaultPage';
import LoadingPage from '@/component/LoadingPage';

/**
 * 角色列表
 */


const {Item} = List;

export default function(props) {
  //id可能是 docId 也可能是 gameId
  const {list, loading, document, game} = props;


  //点击行
  function clickDocument(role) {
    if(game){
      router.push('/games/' + game._id + '/roles/' + role._id);
    }else{
      router.push('/documents/' + document._id + '/roles/' + role._id);
    }
  }
  if(loading){
    return <LoadingPage/>
  }
  if(list.length>0){
    return (
      <List >
        {list.map((role, index)=>{
          return <Item key={index} wrap onClick={()=>clickDocument(role)} arrow={'horizontal'}
                       extra={!role.publishFlag?'未完成':null} thumb={role.photo?role.photo:require('../assets/img/contact_default.png')}
          >
            {role.name}
            <Item.Brief>
              {role.description||'暂无描述'}
              </Item.Brief>
          </Item>
        })}
      </List>
    )
  }else{
    return (
      <DefaultPage
        content={'去创建一个新角色吧'}
      />
    )
  }
};
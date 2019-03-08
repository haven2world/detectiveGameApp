'use strict';
import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal} from 'antd-mobile';
import router from 'umi/router';
import DefaultPage from '@/component/DefaultPage';
import ScrollableList from '@/component/ScrollableList';
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
      <ScrollableList>
        {list.map((role, index) => {
          return <Item key={index} wrap onClick={() => clickDocument(role)} arrow={'horizontal'}
                       thumb={<img
                         src={role.photo ? role.photo : require('@/assets/img/contact_default.png')}
                         style={{ height: 50, width: 50, borderRadius: 25, border: '1px solid #f5f5f9', objectFit: 'cover', }}
                       />}
          >
            {role.name}
            <Item.Brief>
              {role.description || '暂无描述'}</Item.Brief>
          </Item>;
        })}
      </ScrollableList>
    )
  }else{
    return (
      <DefaultPage
        content={'去创建一个新角色吧'}
      />
    )
  }
};
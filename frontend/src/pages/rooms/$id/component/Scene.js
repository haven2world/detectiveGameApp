'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import ScrollableList from '@/component/ScrollableList';
import { toast } from '@/utils/toastUtils';
const ListItem = List.Item;

/**
 * 房主场景页
 */

export default function({game}) {

  //进入场景
  function clickRow(sceneId) {
    router.push('/rooms/' + game._id + '/management/scenes/' + sceneId);
  }

  //渲染场景列表
  function renderSceneList() {
    let listView = game.document.scenes.map((scene, index)=>(
      <ListItem key={index} onClick={()=>clickRow(scene._id)} arrow={'horizontal'}>
        {scene.name}
      </ListItem>));
    return listView
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <ScrollableList>
        {renderSceneList()}
      </ScrollableList>
    </div>
  )
}
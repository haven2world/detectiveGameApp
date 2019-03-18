'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import ScrollableList from '@/component/ScrollableList';
import styles from '../document.css';
import { toast } from '@/utils/toastUtils';
const ListItem = List.Item;

/**
 * 剧本任务页
 */

export default function({document, updateDocument, updateSaveTime}) {

  //进入角色任务详情
  function clickRow(sceneId) {
    router.push('/documents/' + document._id + '/scenes/' + sceneId);
  }

  //渲染角色列表
  function renderRoleList() {
    let listView = document.scenes.map((scene, index)=>(
      <ListItem key={index} onClick={()=>clickRow(scene._id)} arrow={'horizontal'}>
        {scene.name}
      </ListItem>));
    return listView
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <ScrollableList>
        {renderRoleList()}
      </ScrollableList>
    </div>
  )
}
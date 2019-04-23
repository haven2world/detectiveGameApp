'use strict';
import { useState, useEffect, useRef } from 'react';
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
 * 房主结局页
 */

export default function({game}) {

  let taskStatus = {};
  game.roles.forEach(role=>{
    if(!role.finishedTask){
      role.finishedTask = {};
    }
    Object.keys(role.finishedTask).forEach((taskId)=>{
      taskStatus[taskId] = role.finishedTask[taskId];
    });
  });
  game.document.endings.forEach(ending=>{
    ending.finishedCount = ending.conditions.filter(condition=>!!taskStatus[condition.taskId]===condition.achieved).length;
  });
  game.document.endings.sort((pre,next)=>{
    return (next.conditions.length - next.finishedCount) - (pre.conditions.length - pre.finishedCount)
  });

  //进入结局
  function clickRow(endingId) {
    router.push('/rooms/' + game._id + '/management/endings/' + endingId);
  }

  //渲染结局列表
  function renderEndingList() {

    return game.document.endings.map((ending, index)=>{
      let className = ending.finishedCount === ending.conditions.length?'success-text':'';
      return (
      <ListItem key={index} onClick={()=>clickRow(ending._id)} arrow={'horizontal'}>
        {ending.name}
        <ListItem.Brief>
          <span className={className}>完成条件：{ending.finishedCount}/{ending.conditions.length}</span>
        </ListItem.Brief>
      </ListItem>)});
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <ScrollableList>
        {renderEndingList()}
      </ScrollableList>
    </div>
  )
}
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
 * 剧本故事页
 */

export default function({document, updateDocument, updateSaveTime}) {


  //创建阶段
  function createStoryStage() {
    services.createStoryStage(document._id).then(result=>{
      if(result && result.code === 0){
        toast.success('创建成功！');
        document.storyStageCount = result.data.storyStageCount;
        updateSaveTime(new Date);
      }
    })
  }

  //进入阶段
  function clickRow(stageCount) {
    router.push('/documents/' + document._id + '/stages/' + stageCount);
  }
  
  //删除最后一个阶段
  function deleteLastStage() {
    services.deleteLastStage(document._id).then(result=>{
      if(result && result.code === 0){
        toast.success('删除成功！');
        document.storyStageCount = result.data.storyStageCount;
        updateSaveTime(new Date);
      }
    })
  }

  //渲染阶段列表
  function renderStageList() {
    let listView = [];
    for(let i=0;i<document.storyStageCount;++i){
      listView.push(<ListItem key={i} onClick={()=>clickRow(i)} arrow={'horizontal'}>
        第{i+1}阶段
      </ListItem>);
    }
    return listView
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <WingBlank>
        <WhiteSpace/>
        <Button className={styles.listButton} onClick={createStoryStage} type={'ghost'}>新增阶段</Button>
        <WhiteSpace/>
      </WingBlank>
      <ScrollableList
        renderFooter={()=>RenderIf(document.storyStageCount>0)(
          <Button onClick={deleteLastStage} type={'warning'}>删除最后一个阶段</Button>
        )}
      >
        {renderStageList()}
      </ScrollableList>
    </div>
  )
}
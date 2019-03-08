'use strict';

import { useState, useEffect } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { isInArray, RenderIf } from '@/utils/commonUtils';

const ListItem = List.Item;

/**
 * 剧本故事列表
 */

export default function({computedMatch}) {
  const {id:docId} = computedMatch.params;
  const stageCount = Number(computedMatch.params.stageCount);

  const [stories, setStories] = useState(undefined);
  const [loading, setLoading] = useState(false);

  //初始化
  useEffect(()=>{
    updateStories();
  },[]);


  //获取角色故事列表
  function updateStories(){
    setLoading(true);
    services.fetchStoriesInStage(docId, stageCount).then(result=>{
      if(result && result.code === 0){
        setStories(result.data.stories);
        setLoading(false);
      }
    })
  }

  //点击故事
  function clickDocument(role){

  }

  //渲染角色列表
  function renderList() {
    return stories.map((role,index)=>{
      return (
        <ListItem key={index} wrap onClick={() => clickDocument(role)} arrow={'horizontal'}
              thumb={<img
                src={role.photo ? role.photo : require('@/assets/img/contact_default.png')}
                style={{ height: 50, width: 50, borderRadius: 25, border: '1px solid #f5f5f9', objectFit: 'cover', }}
              />}
        >
          {role.name}
          <ListItem.Brief>
            {role.story?role.story.content.slice(0,10)+'...' : '尚未编写故事'}</ListItem.Brief>
        </ListItem>);
    });
  }

  if(stories){
    return (
      <div className={'container flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >第{stageCount+1}阶段</NavBar>
        <ScrollableList>
          {renderList()}
        </ScrollableList>
      </div>
    )
  }else{
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >第{stageCount+1}阶段</NavBar>
        <LoadingPage/>
      </div>
    )
  }

}



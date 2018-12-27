'use strict';
import { useState, useEffect, createElement } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import styles from './document.css';
import Base from './component/Base';
import Role from './component/Role';
import Story from './component/Story';

/**
 * 剧本详情页
 */

export default function({computedMatch}) {
  const {id:docId} = computedMatch.params;

  let tabs = [];

  //状态
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveTime, setSaveTime] = useState(null);

  //初始化
  useEffect(()=>{
    if(!document && !loading){
      updateDocument();
    }
  });


  //获取剧本详情
  function updateDocument(){
    setLoading(true);
    services.fetchDocumentDetail(docId).then(result=>{
      if(result && result.code === 0){
        setDocument(result.data.document);
        if(!saveTime && result.data.document.updateTime){
          setSaveTime(new Date(result.data.document.updateTime));
        }
      }
      setLoading(false);
    })
  }

  //计算显示的Tab
  (function calTabs() {
    tabs = [];
    if(!document){
      return
    }
    const tabSort = [
      {stage:'name', title:'基础', component:Base},
      {stage:'role', title:'角色', component:Role},
      {stage:'story', title:'故事', component:Story},
      {stage:'scene', title:'场景', component:Base},
      {stage:'task', title:'任务', component:Base},
      {stage:'ending', title:'结局', component:Base},
      {stage:'difficulty', title:'难度', component:Base},
    ];

    for(let i=0; i<tabSort.length;++i){
      tabs.push({title: tabSort[i].title, component: tabSort[i].component});
      if(tabSort[i].stage === document.composingStage){
        break
      }
    }
  })();


  //渲染保存时间的壳
  function renderTabWrapper(content, index){
    let timeStr = saveTime?`最后保存于：${formatTime(saveTime,true)}`:'数据会自动保存';
    return (
      <div className={'container'} key={index}>
        <NoticeBar className={styles.notice} icon={null}>{timeStr}</NoticeBar>
        {content}
      </div>
    )
  }



  if(document){

    return(
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >剧本</NavBar>
        <Tabs
          initialPage={1}
          tabs={tabs}
          renderTabBar={props =><Tabs.DefaultTabBar {...props} swipeable />}
        >
          {tabs.map((tab, index)=>renderTabWrapper(createElement(tab.component, {document, updateDocument, updateSaveTime:setSaveTime}), index))}
        </Tabs>
      </div>
    )
  }else{
    return(
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >剧本</NavBar>
        <LoadingPage/>
      </div>
    )
  }

}
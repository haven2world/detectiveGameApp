'use strict';
import { useState, useEffect, createElement } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import {toast} from '@/utils/toastUtils';
import {useTab} from '@/utils/hookUtils';
import styles from './document.css';
import Base from './component/Base';
import Role from './component/Role';
import Story from './component/Story';
import Scene from './component/Scene';
import Task from './component/Task';
import Ending from './component/Ending';
import Difficulty from './component/Difficulty';

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
  const [tab, setTab] = useTab(3,'documents-index-tab');

  //初始化
  useEffect(()=>{
    updateDocument();
  },[]);


  //获取剧本详情
  function updateDocument(){
    setLoading(true);
    services.fetchDocumentDetail(docId).then(result=>{
      if(result && result.code === 0){
        setDocument(result.data.document);
        if(!saveTime && result.data.document.updateTime){
          setSaveTime(new Date(result.data.document.updateTime));
        }
        setLoading(false);
      }
    })
  }

  //发布剧本
  function publish() {
    Modal.alert('确认发布','一旦发布就可以在游戏中创建了,之后的修改都会实时生效在创建的游戏中',[
      {text:'取消',},
      {text:'发布',onPress:()=>{
        services.publishDocument(docId).then(result=>{
          if(result && result.code === 0){
            document.publishFlag = true;
            toast.light('发布成功');
            setSaveTime(new Date());
          }
        })
        }}
    ])
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
      {stage:'scene', title:'场景', component:Scene},
      {stage:'task', title:'任务', component:Task},
      {stage:'ending', title:'结局', component:Ending},
      {stage:'difficulty', title:'难度', component:Difficulty},
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
      <div key={index} className={'container flex-column-container'}>
        <div style={{height:44}}>
          <NoticeBar className={styles.notice} icon={null}>{timeStr}</NoticeBar>
        </div>
        <div style={{flex:1}}>
          {content}
        </div>
      </div>
    )
  }

  //渲染发布键
  function renderPublish() {
    if(document.publishFlag){
      return <div style={{padding:5,opacity:0.6}} >已发布</div>
    }else if(document.composingStage === 'difficulty'){
      return <div style={{padding:5}} onClick={publish}>发布</div>
    }else{
      return <div style={{padding:5,opacity:0.6}} onClick={()=>toast.info('还未编写完成所有内容，请完成后发布')}>发布</div>
    }
  }

  if(document){

    return(
      <div className={'container flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
          rightContent={renderPublish()}
        >剧本</NavBar>
        <Tabs
          page={tab}
          onChange={(tab,index)=>setTab(index)}
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
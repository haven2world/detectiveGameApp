'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { Toast } from 'antd-mobile/lib/index';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import styles from './document.css';
import Base from './component/Base';

/**
 * 剧本详情页
 */

export default function({computedMatch}) {
  const {id:docId} = computedMatch.params;

  const tabs = [
    {title:'基础'},
    {title:'故事'},
    {title:'场景'},
    {title:'任务'},
    {title:'结局'},
    {title:'难度'},
  ];

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


  //渲染保存时间的壳
  function renderTabWrapper(content){
    let timeStr = saveTime?`最后保存于：${formatTime(saveTime,true)}`:'数据会自动保存';
    return (
      <div className={'container'}>
        <NoticeBar className={styles.notice} icon={null}>{timeStr}</NoticeBar>
        {content}
      </div>
    )
  }

  //todo 按阶段显示tab

  if(document){

    return(
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >剧本</NavBar>
        <Tabs
          tabs={tabs}
          renderTabBar={props =><Tabs.DefaultTabBar {...props} swipeable />}
        >
          {renderTabWrapper(<Base document={document} updateDocument={updateDocument} updateSaveTime={setSaveTime} />)}
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
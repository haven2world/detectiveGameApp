'use strict';
import { useState, useEffect, createElement } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, NoticeBar} from 'antd-mobile';
import { RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import {toast} from '@/utils/toastUtils';
import {useTab} from '@/utils/hookUtils';
import Overview from './component/Overview';
import Role from './component/Role';
import gameStatus from '@/constant/gameStatus';
import managerActions from '@/constant/managerActions';

/**
 * 房主详情页
 */

export default function({computedMatch}) {
  const {id:gameId} = computedMatch.params;

  //状态
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useTab(3,'manager-index-tab');

  //初始化
  useEffect(()=>{
    updateGame();
  },[]);


  //获取剧本详情
  function updateGame(){
    setLoading(true);
    services.fetchGameDetail(gameId).then(result=>{
      if(result && result.code === 0){
        setGame(result.data.game);
        setLoading(false);
      }
    })
  }
  
  //结束游戏
  function endGame() {
    Modal.alert('警告','一旦结束游戏，所有玩家都将无法继续游戏，也无法重新开启，请慎重操作',[
      {text:'取消',},
      {text:'确认结束',onPress:()=>{
          services.changeGameStatus(gameId,{status:gameStatus.over, action:managerActions.OVER_GAME}).then(result=>{
            if(result && result.code === 0){
              toast.success('游戏已结束');
              router.goBack();
            }
          })
        },
      style:{color:'#ff4040'}}
    ])
  }

  const tabs = [
    {stage:'overView', title:'总览', component:Overview},
    {stage:'role', title:'角色', component:Role},
    {stage:'scene', title:'场景', component:Overview},
    {stage:'ending', title:'结局', component:Overview},
  ];

  if(game){

    return(
      <div className={'container flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
          rightContent={<span style={{fontSize:16, color:'#ff4040' }} onClick={endGame}>结束</span> }
        >{game.document.name} - 管理</NavBar>
        <Tabs
          page={tab}
          onChange={(tab,index)=>setTab(index)}
          tabs={tabs}
          renderTabBar={props =><Tabs.DefaultTabBar {...props} swipeable />}
        >
          {tabs.map((tab, index)=>createElement(tab.component, {game, updateGame, key:index}))}
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
        >加载中...</NavBar>
        <LoadingPage/>
      </div>
    )
  }

}
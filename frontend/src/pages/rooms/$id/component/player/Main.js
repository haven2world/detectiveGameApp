import React,{useEffect, useState, useContext} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import playerActions from '@/constant/playerActions';
import gameStatus from '@/constant/gameStatus';

const ListItem = List.Item;

/**
 * 游戏主界面
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game} = ctx.store;

  //初始化数据
  useEffect(()=>{
    ctx.actions(playerActions.INIT_GAME)
  },[]);


  //渲染标题
  function renderTitle() {
    let title = game.document.name;
    let isPause = game.status === gameStatus.pause;
    if(isPause){
      title = '暂停中';
    }

    return <span className={isPause?'warning-text':''}>{title}</span>
  }

  if(!game){
    return (
      <div>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >加载中...</NavBar>
        <LoadingPage/>
      </div>);
  }else{
    return (
      <div>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >{renderTitle()}</NavBar>
      </div>);
  }
}
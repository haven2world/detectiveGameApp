import React,{useEffect, useState, useContext, createElement} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, Drawer} from 'antd-mobile';
import styles from './player.css';
import Player from '@/pages/rooms/$id/player';
import gameViewActions from '@/constant/gameViewActions';

/**
 * 选择阶段的抽屉
 */

export default function({setContentView}) {
  const ctx = useContext(Player.Context);
  const {game, currentStage} = ctx.store;

  function onChooseStage(i){
    setContentView('story');
    ctx.dispatch({type:gameViewActions.SET_STAGE, data:{stage:i}});
    ctx.dispatch({type:gameViewActions.TOGGLE_STAGE});
  }

  let stages = [];
  for(let i=1; i<=game.stage;++i){
    let isActive = currentStage===i;
    stages.push(<List.Item
      key={i} className={isActive?styles.activeStageInDrawer:''}
      onClick={()=> onChooseStage(i)}
    >
      <span style={isActive?{color:'#fff'}:{}}>第&nbsp;{i}&nbsp;阶段</span>
    </List.Item>)
  }

  if(stages.length===0){
    stages.push(<List.Item>游戏尚未开始</List.Item>)
  }

  return stages
}
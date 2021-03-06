import React,{useEffect, useState, useContext} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, Badge, } from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import playerActions from '@/constant/playerActions';
import gameViewActions from '@/constant/gameViewActions';
import gameStatus from '@/constant/gameStatus';
import styles from './player.css';

/**
 * 底部操作栏
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, currentStage, showStage, clueNewFlag, taskNewFlag, newSceneFlag} = ctx.store;
  const {setContentView, currentContentView} = props;

  //toggle 阶段选择
  function toggleStageDrawer() {
    ctx.dispatch({type:gameViewActions.TOGGLE_STAGE});
  }

  //打开线索页面
  function openClueView(){
    if(currentContentView==='clue'){
      setContentView('story');
    }else{
      setContentView('clue');
    }
  }
  //打开任务页面
  function openTaskView(){
    if(currentContentView==='task'){
      setContentView('story');
    }else{
      setContentView('task');
    }
  }

  //跳转下一阶段
  let nextStageIsEnding = game.sentEnding && game.document.storyStageCount===currentStage;
  let currentIsEnding = currentStage === 'ending';
  function nextStage() {
    if(nextStageIsEnding){
      setContentView('story');
      ctx.dispatch({type:gameViewActions.SET_STAGE, data:{stage:'ending'}});
    }else if(currentIsEnding) {
      toast.info('已经是结局了');
    }else if(game.stage-currentStage){
      setContentView('story');
      ctx.dispatch({type:gameViewActions.SET_STAGE, data:{stage:currentStage+1}});
    }else{
      toast.info('当前已经是最新阶段，请等待房主推进剧情');
    }
  }
  //前往搜证页面
  function openCombVIew() {
    if(currentContentView==='scene'){
      setContentView('story');
    }else{
      setContentView('scene');
    }
  }

  const buttons = [
    {
      title:'阶段',
      icon:'fa-bars',
      onClick:toggleStageDrawer,
      active:showStage
    },
    {
      title:'线索',
      icon:'fa-eye',
      onClick:openClueView,
      active:currentContentView==='clue',
      newFlag:clueNewFlag,
    }
  ];

  return (<div className={classnames(['flex-container', styles.bottomBarWrapper])}>
    {buttons.map((button, index)=>
      <BarButton {...button} key={index} />)}
    <div className={'flex-container'} style={{flex:1, justifyContent: 'flex-end'}}>
      {RenderIf(!game.sentEnding)(
        <div className={classnames([styles.bottomBarPrimaryButton, styles.bottomBarSearchButton, 'clickable'])} onClick={openCombVIew}>
          <Badge dot={newSceneFlag}>
            搜证
          </Badge>
        </div>
      )}

      <div
        className={classnames([styles.bottomBarPrimaryButton, 'clickable',
          (game.stage===currentStage&&!nextStageIsEnding || currentIsEnding)?styles.bottomBarPrimaryButtonInactive:''])}
        onClick={nextStage}>
        {(nextStageIsEnding||currentIsEnding)?'查看结局':'下一阶段'}
      </div>
    </div>
  </div>)
}

function BarButton({title, icon, onClick, active, newFlag}) {

  return (<div className={classnames(['flex-column-container', 'clickable', styles.bottomBarButton, active?styles.bottomBarButtonActive:''])} onClick={onClick}>
    <Badge dot={newFlag}>
      <i className={'fa '+ icon} />
    </Badge>
    <div>{title}</div>
  </div>)
}
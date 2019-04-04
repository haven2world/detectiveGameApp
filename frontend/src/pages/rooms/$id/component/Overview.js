'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import ScrollableList from '@/component/ScrollableList'
import { useInputAutoSave } from '@/utils/hookUtils';
import gameStatus from '@/constant/gameStatus';
import managerActions from '@/constant/managerActions';
import { toast } from '@/utils/toastUtils';

const ListItem = List.Item;

/**
 * 游戏总览页
 */

export default function({game, updateGame}) {


  //保存
  async function save() {
    let key = arguments[0];
    let param = {};
    if(typeof key === 'object'){
      Object.keys(key).forEach(k=>{
        let v = key[k];
        if(v && game[k] !== v){
          param[k] = v;
        }
      })
    }else{
      return;
    }
    let result = await services.changeGameStatus(game._id, param);
    if(result && result.code === 0){
      updateGame();
      return true;
    }
  }

  //推送结局
  function sendEnding() {
    if(game.sentEnding){
     toast.fail('已经推送过结局');
     return;
    }
    Modal.alert('提示','一旦推送结局，游戏将结束，之后只能通过历史记录查看游戏',[
      {text:'取消',},
      {text:'确认推送',onPress:async ()=>{
          let result = await save({sentEnding:true, status:gameStatus.over , action:managerActions.SEND_ENDING});
          result && toast.success('结局已经推送，游戏已经结束');
        },
        style:{color:'#ff4040'}
      }
    ])
  }

  //推送下一阶段
  function pushNextStage() {
    Modal.alert('提示','确认要推送第' + (game.stage+1) + '阶段故事给玩家吗？',[
      {text:'取消',},
      {text:'确认推送',onPress:async ()=>{
          let result = await save({stage:game.stage+1, action:managerActions.PUSH_STAGE});
          result && toast.light('推送成功');
        },
        style:{color:'#ff4040'}
      }
    ])
  }

  //开始游戏
  function startGame() {
    Modal.alert('提示','确认要开始游戏吗？',[
      {text:'取消',},
      {text:'确认',onPress:async ()=>{
          let result = await save({status:gameStatus.playing, stage:1, action:managerActions.START_GAME});
          result && toast.light('游戏已开始');
        },
        style:{color:'#ff4040'}
      }
    ])
  }

  //暂停游戏或继续
  function pauseGame() {
    let isPaused = game.status===gameStatus.pause;
    Modal.alert('提示',`确认要${isPaused?'继续':'暂停'}游戏吗？`,[
      {text:'取消',},
      {text:'确认',onPress:async ()=>{
          let result = await save({
            status:isPaused?gameStatus.playing:gameStatus.pause,
            action:isPaused?managerActions.RESUME_GAME:managerActions.PAUSE_GAME
          });
          result && toast.light(`游戏已${isPaused?'继续':'暂停'}`);
        },
        style:{color:'#ff4040'}
      }
    ])
  }

  //渲染阶段
  function renderStage() {
    let started = game.status!==gameStatus.preparation;
    let allStagedPushed = game.stage === game.document.storyStageCount;

    let currentStageView = (<span className={'gray-text'}>第&nbsp;{game.stage}&nbsp;阶段</span>);
    let buttonContent = '推送下一阶段';
    let clickHandler = pushNextStage;
    if(!started){
      currentStageView = (<span className={'gray-text'}>准备中</span>);
      buttonContent = '开始游戏';
      clickHandler = startGame;
    }
    if(allStagedPushed){
      buttonContent = '发送结局';
      clickHandler = sendEnding;
    }
    if(game.sentEnding){
      currentStageView = (<span className={'gray-text'}>已结局</span>);
    }
    return(
      <ListItem>
        <div className={'title-row flex-container'}>
          <span style={{flex:1}}>当前阶段</span>
          <Button type={'ghost'} size={'small'} onClick={clickHandler} disabled={game.status===gameStatus.over}>{buttonContent}</Button>
        </div>
        <div className={'flex-center'}>{currentStageView}</div>
      </ListItem>
    )
  }

  //渲染状态
  function renderStatus() {
    let started = game.status!==gameStatus.preparation;
    let isPaused = game.status===gameStatus.pause;

    let statusMap = {
      [gameStatus.preparation]:'准备中',
      [gameStatus.playing]:'进行中',
      [gameStatus.pause]:'已暂停',
      [gameStatus.over]:'已结束',
    };
    let currentStatus = statusMap[game.status];
    let buttonContent = isPaused?'继续游戏':'暂停';
    let clickHandler = pauseGame;

    if(!started){
      buttonContent = '开始游戏';
      clickHandler = startGame;
    }

    return(
      <ListItem>
        <div className={'title-row flex-container'}>
          <span style={{flex:1}}>游戏状态</span>
          <Button type={'ghost'} size={'small'} onClick={clickHandler} disabled={game.status===gameStatus.over}>{buttonContent}</Button>
        </div>
        <div className={'flex-center'}><span className={'gray-text'}>{currentStatus}</span></div>
      </ListItem>
    )
  }
  return(
    <div className={'container flex-column-container'}>
      <ScrollableList>
        {renderStage()}
        {renderStatus()}
      </ScrollableList>
    </div>
  )
}
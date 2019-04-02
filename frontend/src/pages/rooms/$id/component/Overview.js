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
  function save() {
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
    services.changeGameStatus(game._id, param).then(result=>{
      if(result && result.code === 0){
        updateGame();
      }
    })
  }

  //推送结局
  function sendEnding() {
    if(game.sentEnding){
     toast.fail('已经推送过结局');
     return;
    }
    save({sentEnding:true, action:managerActions.SEND_ENDING});
  }

  //推送下一阶段
  function pushNextStage() {
    save({stage:game.stage+1, action:managerActions.PUSH_STAGE});
  }

  //开始游戏
  function startGame() {
    save({status:gameStatus.playing, stage:1, action:managerActions.START_GAME});
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
          <Button type={'ghost'} size={'small'} onClick={clickHandler}>{buttonContent}</Button>
        </div>
        <div className={'flex-center'}>{currentStageView}</div>
      </ListItem>
    )
  }

  return(
    <div className={'container flex-column-container'}>
      <ScrollableList>
        {renderStage()}
      </ScrollableList>
    </div>
  )
}
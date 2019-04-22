import React,{useEffect, useState, useContext} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, Checkbox} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import gameViewActions from '@/constant/gameViewActions';
import gameStatus from '@/constant/gameStatus';
import styles from './player.css';

const CheckboxItem = Checkbox.CheckboxItem;
const ListItem = List.Item;

/**
 * 任务场景显示
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, taskNewFlag} = ctx.store;

  if(taskNewFlag){
    //置为已读
    ctx.dispatch({type:gameViewActions.SET_NEW_FLAG, data:{taskNewFlag: false}});
  }

  //渲染场景列表
  function renderTasks() {
    if(!game.currentRole.finishedTask){
      game.currentRole.finishedTask = {};
    }
    let finishedTask = game.currentRole.finishedTask;
    return game.document.tasks.sort((pre, next)=>(finishedTask[pre._id]&&!finishedTask[next._id]?1:-1)).map(task=>{
      return <CheckboxItem wrap key={task._id} checked={finishedTask[task._id]}>
        {task.content}
      </CheckboxItem>
    });
  }

  return (<div className={classnames(['container flex-column-container'])}>
    <ListItem >需要完成的任务</ListItem>
    <ScrollableList>
      {renderTasks()}
    </ScrollableList>
  </div>)
}
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
import AvatarCard from '@/component/AvatarCard';

const CheckboxItem = Checkbox.CheckboxItem;
const ListItem = List.Item;

/**
 * 个人汇总显示
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, taskNewFlag, shownRowDetail} = ctx.store;

  const isYourself = !!shownRowDetail.sharedClues;

  if(taskNewFlag){
    //置为已读
    ctx.dispatch({type:gameViewActions.SET_NEW_FLAG, data:{taskNewFlag: false}});
  }

  //渲染任务列表
  function renderTasks() {
    if(!isYourself){
      return null;
    }
    if(!game.currentRole.finishedTask){
      game.currentRole.finishedTask = {};
    }
    let finishedTask = game.currentRole.finishedTask;
    return game.document.tasks.sort((pre, next)=>(finishedTask[pre._id]&&!finishedTask[next._id]?1:-1)).map(task=>{
      return <ListItem wrap key={task._id} thumb={<div className={finishedTask[task._id]?'success-text':''}>{finishedTask[task._id]?'【已完成】':'【未完成】'}</div>} >
        {task.content}
      </ListItem>
    });
  }
  
  //渲染技能列表
  function renderSkills() {
    if(!isYourself){
      return null;
    }
    return game.currentRole.document.skills.map((skill, index)=>{
      let skillUse = game.currentRole.skillUse[index]||{count:0};
      let left = '无限';
      if(skill.maxCount){
        left = (skill.maxCount-skillUse.count)+ '/' + (skill.maxCount);
      }
      return <ListItem key={index} extra={<div>{left}</div>} wrap={true}>
        {skill.skillInfo.name}
        <ListItem.Brief style={{whiteSpace:'wrap'}}>
          {skill.skillInfo.description}
        </ListItem.Brief>
      </ListItem>
    });
  }

  return (<div className={classnames(['container flex-column-container'])}>
    <ScrollableList>
      <AvatarCard
        editable={false}
        url={shownRowDetail.document.photo}
        name={shownRowDetail.document.name}
        description={shownRowDetail.document.description}
      />
      {RenderIf(isYourself)(
        <ListItem ><span className='title-row'>需要完成的任务</span></ListItem>
      )}
      {renderTasks()}
      {RenderIf(isYourself && game.currentRole.document.skills.length>0)(
        <ListItem ><span className='title-row'>技能</span></ListItem>
      )}
      {renderSkills()}

    </ScrollableList>
  </div>)
}
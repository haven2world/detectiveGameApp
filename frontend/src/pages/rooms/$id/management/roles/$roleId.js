'use strict';

import { useState, useEffect } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, NoticeBar, Accordion, Checkbox} from 'antd-mobile';
import * as services from '@/utils/services';
import { useInputAutoSave } from '@/utils/hookUtils/index';
import { RenderIf } from '@/utils/commonUtils';
import ScrollableList from '@/component/ScrollableList'
import LoadingPage from '@/component/LoadingPage'
import router from 'umi/router';
import { toast } from '@/utils/toastUtils';
import managerActions from '@/constant/managerActions';

const ListItem = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AccordionPanel = Accordion.Panel;
/**
 * 角色游戏信息概览
 */

export default function({computedMatch}) {
  const {id:gameId, roleId} = computedMatch.params;

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  //初始化
  useEffect(()=>{
    updateRole();
  },[]);

  //获取角色详情
  function updateRole(){
    services.fetchPlayingRoleDetail(gameId, roleId).then(result=>{
      if(result && result.code === 0){
        let roleData = result.data.role
        roleData.clues.sort((pre,next)=>((next.shared && !pre.shared)?1:-1));
        if(!roleData.finishedTask){
          roleData.finishedTask = {};
        }
        setRole(result.data.role);
        setLoading(false);
      }
    });
  }

  //修改任务完成情况
  function toggleTask(task) {
    let param = {
      finished:!role.finishedTask[task._id],
      action:!role.finishedTask[task._id]?managerActions.ENSURE_TASK:managerActions.CANCEL_TASK
    };
    let finishStatusMap = {
      true:'完成',
      false:'未完成'
    };
    Modal.alert('提示',<div>将{role.document.name}的该任务设为<strong className={'error-text'}>{finishStatusMap[param.finished]}</strong>吗 ?({task.content})</div>,[
      {text:'取消',onPress:()=>{setRole(role)}},
      {text:'确认',onPress:()=>{
          services.changeTaskStatus(gameId, roleId, task._id, param).then(result=>{
            if(result && result.code === 0){
              let temp = Object.assign({},role);
              temp.finishedTask[task._id] = param.finished;
              setRole(temp);
              toast.light('修改成功');
            }
          })
        }}
    ])
  }

  //将一位玩家移出房间
  function removePlayer() {
    Modal.alert('提示',<div>确定将<strong className={'error-text'}>{role.document.name}</strong>的扮演者<strong className={'error-text'}>请离</strong>当前游戏吗 ?<br/>(请离后其他人无法再扮演该角色可能导致游戏异常)</div>,[
      {text:'取消',onPress:()=>{setRole(role)}},
      {text:'确认',onPress:()=>{
          services.removeRoleFromGame(gameId, roleId, {action:managerActions.REMOVE_PLAYER}).then(result=>{
            if(result && result.code === 0){
              toast.success('移除成功');
              router.goBack();
            }
          })
        }}
    ])
  }

  //渲染拥有的线索
  function renderClue() {
    return (<List>
      {role.clues.map(clue=><ListItem key={clue._id} wrap>
        {clue.shared?'【共享】':'【私有】'}{clue.document.name}
        <ListItem.Brief>
          位于：{clue.scene}<br/>
          {clue.document.content}
        </ListItem.Brief>
      </ListItem>)}
    </List>)
  }

  //渲染技能使用情况
  function renderSkill() {
    if(role.document.skills.length){
      return(
        <List>
          {role.document.skills.map((skill, index)=><ListItem key={skill._id} wrap>
            {skill.skillInfo.name}
            <ListItem.Brief>
              使用次数：{role.skillUse[index].count}/{skill.maxCount}<br/>
              {skill.skillInfo.description}
            </ListItem.Brief>
          </ListItem>)}
        </List>
      )
    }else{
      return (
        <List>
          <ListItem>该角色无技能</ListItem>
        </List>
      )
    }
  }

  //渲染任务完成情况
  function renderTask() {
    return (
      <List>
        {role.tasks.map(task=><CheckboxItem checked={role.finishedTask[task._id]} key={task._id} wrap onChange={()=>toggleTask(task)}>
          {task.content}
        </CheckboxItem>)}
      </List>
    )
  }

  if(loading){
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >加载中...</NavBar>
        <LoadingPage/>
      </div>
    )
  }else{
    return (
      <div className={'container  flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
          rightContent={<span className="clickable error-text" style={{fontSize:16,}} onClick={removePlayer} >请离</span>}
        >{role.document.name}</NavBar>
        <ScrollableList>
          <Accordion defaultActiveKey={'clue'} accordion>
            <AccordionPanel key={'clue'} header={'拥有的线索'}>
              {renderClue()}
            </AccordionPanel>
            <AccordionPanel key={'skill'} header={'技能使用'}>
              {renderSkill()}
            </AccordionPanel>
            <AccordionPanel key={'task'} header={'达成任务'}>
              {renderTask()}
            </AccordionPanel>
          </Accordion>
        </ScrollableList>
      </div>
    )
  }
}
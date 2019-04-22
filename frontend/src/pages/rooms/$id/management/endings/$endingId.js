'use strict';

import { useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper, Checkbox} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { changeQuery, isInArray, RenderIf } from '@/utils/commonUtils';
import { useInputAutoSave } from '@/utils/hookUtils';
import managerActions from '@/constant/managerActions';

const ListItem = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;

/**
 * 剧本结局列表
 */

export default function({computedMatch}) {
  const {id:gameId,endingId} = computedMatch.params;

  const [endingDoc, setEndingDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const roleGameMap = useRef({});//生成 roleDocId 到 roleGame 的映射

  //初始化
  useEffect(()=>{
    updateEnding();
  },[]);


  //获取结局片段
  function updateEnding(){
    setLoading(true);
    services.fetchPlayingEndingDetail(gameId, endingId).then(result=>{
      if(result && result.code === 0){
        //生成 roleDocId 到 roleGame 的映射
        result.data.ending.roles.forEach(role=>{
          roleGameMap.current[role.roleDocumentId] = role;
        });
        setEndingDoc(result.data.ending);
        setLoading(false);
      }
    })
  }



  //修改任务完成情况
  function toggleCondition(condition) {
    const {taskMap, roleMap} = endingDoc;
    let task = taskMap[condition.taskId];
    let role = roleGameMap.current[task.belongToRoleId];
    let param = {
      finished:!role.finishedTask[task._id],
      action:!role.finishedTask[task._id]?managerActions.ENSURE_TASK:managerActions.CANCEL_TASK
    };
    let finishStatusMap = {
      true:'完成',
      false:'未完成'
    };
    Modal.alert('提示',<div>将{roleMap[task.belongToRoleId].name}的该任务设为<strong className={'error-text'}>{finishStatusMap[param.finished]}</strong>吗?</div>,[
      {text:'取消'},
      {text:'确认',onPress:()=>{
          services.changeTaskStatus(gameId, role._id, task._id, param).then(result=>{
            if(result && result.code === 0){
              let role = roleGameMap.current[task.belongToRoleId];
              role.finishedTask[task._id] = param.finished;
              let temp = Object.assign({},endingDoc);
              setEndingDoc(temp);
              toast.light('修改成功');
            }
          })
        }}
    ])
  }


  //渲染条件列表
  function renderConditions() {
    const {taskMap, roleMap} = endingDoc;
    endingDoc.conditions.sort((pre, next)=>{
      if(!pre.achieved && next.achieved){
        return 1;
      }else{
        return -1;
      }
    });
    return endingDoc.conditions.map((condition, index)=>{
      let task = taskMap[condition.taskId]
      let checked = !!roleGameMap.current[task.belongToRoleId].finishedTask[task._id] === condition.achieved;
      return (<CheckboxItem className={'closed-checkbox'} key={condition._id} wrap onChange={()=>toggleCondition(condition)} checked={checked}>
          【{condition.achieved?'完成任务':'任务失败'}】{roleMap[taskMap[condition.taskId].belongToRoleId].name}：{taskMap[condition.taskId].content}
        </CheckboxItem>
      )
    });
  }

  if(loading || !endingDoc){
    return (
      <div className={'container flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >结局片段</NavBar>
        <LoadingPage/>
      </div>
    )

  }else{
    return (
      <div className={'container flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >结局片段</NavBar>
        <ScrollableList>
          <ListItem>
            <div className={'title-row'}>
              <span className={'gray-text'}>名称：</span>
            </div>
            <div>&nbsp;&nbsp;&nbsp;{endingDoc.name}</div>
          </ListItem>
          <ListItem>
            <div className={'title-row'}>
              <span className={'gray-text'}>生效条件：需同时满足</span>
            </div>
            {renderConditions()}
          </ListItem>
          <ListItem>
            <div className={'title-row'}>
              <span className={'gray-text'}>内容：</span>
            </div>
            <div dangerouslySetInnerHTML={{__html:endingDoc.content}}/>
          </ListItem>
        </ScrollableList>
      </div>
    )

  }

}

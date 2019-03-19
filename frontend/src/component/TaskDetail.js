'use strict';
import { useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper, Switch, Picker } from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { isInArray, RenderIf } from '@/utils/commonUtils';
import { useInputAutoSave } from '@/utils/hookUtils';

const ListItem = List.Item;
/**
 * 任务列表页
 */

export default function({editable, tasks, roleId, docId, loading, roleName}) {

  const [taskList, setTaskList] = useState([]);

  useEffect(()=>{
    if(tasks){
      setTaskList(tasks);
    }
  },[tasks]);

  //新增任务
  function addTask(){
    services.createTask(docId,roleId).then(result=>{
      if(result.code === 0){
        let temp = [...taskList];
        temp.push(result.data.task);
        setTaskList(temp);
        toast.light('已创建');
      }
    })
  }

  //删除任务
  function onDelete(taskId){
    let temp = [...taskList];
    temp = temp.filter(task=>task._id!==taskId);
    setTaskList(temp);
  }

  if(loading){
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >&nbsp;</NavBar>
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
        >{roleName}的任务</NavBar>
        <ScrollableList>
          <ListItem>
            <div className={'title-row'}>任务
              <span className={'gray-text subtitle'}>共&nbsp;{taskList.length}&nbsp;条</span>
              {RenderIf(editable)(
                <span className={'pull-right clickable primary-text'} onClick={()=>addTask()}>新增</span>
              )}
            </div>
          </ListItem>
          {taskList.map((task, index)=>{
            return <TaskItem
              key={index}
              index={index}
              task={task}
              docId={docId}
              roleId={roleId}
              editable={editable}
              onDelete={onDelete}
            />
          })}
        </ScrollableList>
      </div>
    )
  }
}

function TaskItem({index, task, editable, roleId, docId, onDelete}) {

  const autoContent = useInputAutoSave((value)=>save('content',value), task.content);
  const [taskDetail,setTask] = useState(task);

  //保存
  function save(key, data) {
    if(data!== undefined && taskDetail[key] !== data){
      let param = {};
      param[key] = data;
      services.modifyTaskInfo(docId, taskDetail._id, param).then(result=>{
        if(result && result.code === 0){
          let temp = {...taskDetail};
          temp[key] = data;
          setTask(temp);
          toast.light('已保存');
        }
      })
    }
  }


  function deleteTask() {
    services.deleteTask(docId, taskDetail._id).then(result=>{
      if(result && result.code === 0){
        toast.light('已删除');
        onDelete(taskDetail._id);
      }
    })
  }

  return (<ListItem>
    <div>
      <span className={'gray-text'}>任务内容：</span>
      <TextareaItem
        placeholder="描述一下这个任务"
        autoHeight
        labelNumber={3}
        editable={editable}
        {...autoContent}
      />
    </div>
    <div className={'primary-text'} style={{position:'absolute', right: 20, top: 5, zIndex:100}}>
      <i className="fas fa-trash-alt clickable" style={{fontSize:16 }} onClick={deleteTask}/>
    </div>
  </ListItem>)

}

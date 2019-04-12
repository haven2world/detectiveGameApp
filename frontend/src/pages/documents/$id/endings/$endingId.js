'use strict';

import { useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper, Checkbox} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import PickerCaller from '@/component/PickerCaller';
import RichEditor from '@/component/RichEditor/RichEditor';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { changeQuery, isInArray, RenderIf } from '@/utils/commonUtils';
import { useInputAutoSave } from '@/utils/hookUtils';

const ListItem = List.Item;

/**
 * 剧本结局列表
 */

export default function({computedMatch,location:{query}}) {
  const {id:docId,endingId} = computedMatch.params;

  const [endingDoc, setEndingDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickerConfig, setPicker] = useState({});
  const picker = useRef(null);

  //初始化
  useEffect(()=>{
    updateEnding();
  },[]);


  //获取结局片段
  function updateEnding(){
    setLoading(true);
    services.fetchEnding(docId, endingId).then(result=>{
      if(result && result.code === 0){
        setEndingDoc(result.data.ending);
        initPicker(result.data.ending.roles);
        setLoading(false);
      }
    })
  }

  //初始化picker
  function initPicker(roles) {
    let config = {
      data:[],
      cols:2,
      title:'请选择角色任务',
      cascade:true
    };
    roles.forEach(role=>{
      if(!role.tasks){
        return;
      }
      let temp = {
        label:role.name,
        value:role._id,
        children:role.tasks.map(task=>({label:task.content,value:task._id}))
      };
      config.data.push(temp);
    });
    setPicker(config);
  }

  //保存
  function save(key, data) {
    if(data && endingDoc[key] !== data){
      let param = {};
      param[key] = data;
      services.modifyEnding(docId, endingId, param).then(result=>{
        if(result && result.code === 0){
          let temp = JSON.parse(JSON.stringify(endingDoc));
          temp[key] = data;
          setEndingDoc(temp);
          toast.light('已保存');
        }
      })
    }
  }

  //修改条件
  function onAddCondition(taskId) {
    services.createEndingCondition(docId, endingId, taskId).then(result=>{
      if(result && result.code === 0){
        let temp = JSON.parse(JSON.stringify(endingDoc));
        temp.conditions.push(result.data.condition);
        setEndingDoc(temp);
        toast.light('已保存');
      }
    });
  }
  //删除条件
  function onDeleteCondition(conditionId) {
    services.deleteTaskCondition(docId, endingId, conditionId).then(result=>{
      if(result && result.code === 0){
        let temp = JSON.parse(JSON.stringify(endingDoc));
        temp.conditions = temp.conditions.filter(condition=>condition._id !== conditionId);
        setEndingDoc(temp);
        toast.light('已保存');
      }
    })
  }

  //选择条件
  function onSelectCondition() {
    picker.current.showPicker();
  }
  
  //勾选条件
  function toggleTask(condition) {
    let param = {achieved: !condition.achieved};
    services.modifyEndingCondition(docId, endingId, condition._id, param).then(result=>{
      if(result && result.code === 0){
        let temp = JSON.parse(JSON.stringify(endingDoc));
        let theCondition = temp.conditions.find(item=>item._id === condition._id);
        theCondition.achieved = param.achieved;
        setEndingDoc(temp);
        toast.light('已保存');
      }
    })
  }

  //渲染条件列表
  function renderConditions() {
    const {taskMap, roleMap} = endingDoc;
    return endingDoc.conditions.map((condition, index)=>
      <ListItem
        key={index}
        thumb={<Checkbox className={'closed-checkbox'} checked={condition.achieved} onChange={()=>toggleTask(condition)} />}
        extra={<div style={{width:'100%'}}  onClick={()=>onDeleteCondition(condition._id)}><i className="fas fa-trash-alt clickable" style={{fontSize:16 }}/></div>}
      >
        <div style={{width:'100%', whiteSpace:'normal'}}>
          {roleMap[taskMap[condition.taskId].belongToRoleId].name}：{taskMap[condition.taskId].content}
        </div>
      </ListItem>
    )
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
    const autoName = useInputAutoSave(str=>save('name',str),endingDoc.name);
    const autoContent = useInputAutoSave(str=>save('content',str),endingDoc.content);
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
            <InputItem {...autoName}/>
          </ListItem>
          <ListItem wrap>
            <div className={'title-row'}>
              <span className={'gray-text'}>生效条件：需同时满足</span>
              <span className={'primary-text pull-right'}><i className="fas fa-plus clickable" style={{fontSize:16 }} onClick={onSelectCondition}/></span>
            </div>
            {renderConditions()}
            <div className={'gray-text'}>ps&nbsp;:&nbsp;&nbsp;勾选则条件为<strong>达成</strong>任务，不勾选为<strong>未达成</strong>，默认为勾选</div>
          </ListItem>
          <ListItem>
            <div className={'title-row'}>
              <span className={'gray-text'}>内容：</span>
            </div>
            <RichEditor
              onSaveContent={(data)=>save('content',data)}
              {...autoContent}
            />
          </ListItem>
        </ScrollableList>
        <PickerCaller
          ref={picker}
          onOk={([roleId,taskId])=>{onAddCondition(taskId)}}
          {...pickerConfig}
        />
      </div>
    )

  }

}

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
  function onChangeCondition(action, taskId) {
    switch(action){
      case 'add':{
        let temp = JSON.parse(JSON.stringify(endingDoc.conditionsTaskId));
        temp.push(taskId);
        save('conditionsTaskId', temp);
        break;
      }
      case 'delete':{
        let temp = JSON.parse(JSON.stringify(endingDoc.conditionsTaskId));
        temp = temp.filter(task=>task!==taskId) ;
        save('conditionsTaskId', temp);
        break;
      }
    }
  }

  //选择条件
  function onSelectCondition() {
    picker.current.showPicker();
  }

  //渲染条件列表
  function renderConditions() {
    const {taskMap, roleMap} = endingDoc;
    return endingDoc.conditionsTaskId.map((condition, index)=>
      <ListItem
        key={index}
        extra={<i className="fas fa-trash-alt clickable" style={{fontSize:16 }} onClick={()=>onChangeCondition('delete',condition)}/>}
      >
        <div style={{width:'100%', whiteSpace:'normal'}}>
          {roleMap[taskMap[condition].belongToRoleId].name}：{taskMap[condition].content}
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
          <ListItem>
            <div className={'title-row'}>
              <span className={'gray-text'}>生效条件：需同时满足</span>
              <span className={'primary-text pull-right'}><i className="fas fa-plus clickable" style={{fontSize:16 }} onClick={onSelectCondition}/></span>
            </div>
            {renderConditions()}
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
          onOk={([roleId,taskId])=>{onChangeCondition('add',taskId)}}
          {...pickerConfig}
        />
      </div>
    )

  }

}

'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { Toast } from 'antd-mobile/lib/index';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import styles from '../document.css';

/**
 * 剧本故事页
 */

export default function({document, updateDocument, updateSaveTime}) {


  //状态
  const [name, setName] = useState(document.name);
  const [description, setDescription] = useState(document.description);
  const [nameTimer, setNameTimer] = useState(null);
  const [descriptionTimer, setDescriptionTimer] = useState(null);



  //修改名称
  function handleChangeName(str){
    nameTimer&&clearTimeout(nameTimer);
    setName(str);
    if(str){
      setNameTimer(setTimeout(()=>{
        save('name', str);
      },3000));
    }
  }
  //修改描述
  const handleChangeDescription = (str)=>{
    descriptionTimer&&clearTimeout(descriptionTimer);
    setDescription(str);
    if(str){
      setDescriptionTimer(setTimeout(()=>{
        save('description', str);
      },3000));
    }
  }
  //保存
  function save(key, str) {
    if(str && document[key] !== str){
      let param = {};
      param[key] = str;
      if(key === 'description' && document.composingStage === 'name'){
        param.composingStage = 'story';
        document.composingStage = 'story';
      }
      services.modifyDocumentDetail(document._id, param).then(result=>{
        if(result && result.code === 0){
          document[key] = str;
          updateSaveTime(new Date);
        }
      })
    }
  }






  return(
    <div className={'container'}>
      <List>
        <InputItem
          labelNumber={3}
          defaultValue={document.name}
          placeholder='剧本名称'
          onChange={handleChangeName}
          onBlur={str=>save('name', str)}
          onVirtualKeyboardConfirm={str=>save('name', str)}
          error={document.name && !name}
          clear
        >名称</InputItem>
        <TextareaItem
          defaultValue={document.description}
          title="描述"
          placeholder={'介绍一下~'}
          autoHeight
          labelNumber={3}
          onChange={handleChangeDescription}
          onBlur={str=>save('description', str)}
          error={document.description && !description}
          clear
        />
      </List>
    </div>
  )
}
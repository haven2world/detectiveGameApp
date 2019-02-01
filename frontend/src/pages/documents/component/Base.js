'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import styles from '../document.css';
import { useInputAutoSave } from '@/utils/hookUtils';

/**
 * 剧本基础页
 */

export default function({document, updateDocument, updateSaveTime}) {


  //状态
  const autoName = useInputAutoSave(str=>save('name',str),document.name);
  const autoDescription = useInputAutoSave(str=>save('description',str),document.description);

  //保存
  function save(key, str) {
    if(str && document[key] !== str){
      let param = {};
      param[key] = str;
      if(key === 'description' && document.composingStage === 'name'){
        param.composingStage = 'role';
        document.composingStage = 'role';
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
          placeholder='剧本名称'
          {...autoName}
          error={document.name && !autoName.current}
          clear
        >名称</InputItem>
        <TextareaItem
          title="描述"
          autoHeight
          labelNumber={3}
          placeholder={'介绍一下~'}
          {...autoDescription}
          error={document.description && !autoDescription.current}
          clear
        />
      </List>
    </div>
  )
}
'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import { useInputAutoSave } from '@/utils/hookUtils';

/**
 * 游戏总览页
 */

export default function({game, updateGame}) {


  //状态
  const autoName = useInputAutoSave(str=>save('name',str),game.name);
  const autoDescription = useInputAutoSave(str=>save('description',str),game.description);

  //保存
  function save(key, str) {
    if(str && game[key] !== str){
      let param = {};
      param[key] = str;
      if(key === 'description' && game.composingStage === 'name'){
        param.composingStage = 'role';
        game.composingStage = 'role';
      }
      services.modifyDocumentDetail(game._id, param).then(result=>{
        if(result && result.code === 0){
          game[key] = str;
        }
      })
    }
  }



  return(
    <div>
      <List>
        <InputItem
          labelNumber={3}
          placeholder='剧本名称'
          {...autoName}
          error={game.name && !autoName.current}
          clear
        >名称</InputItem>
        <TextareaItem
          title="描述"
          autoHeight
          labelNumber={3}
          placeholder={'介绍一下~'}
          {...autoDescription}
          error={game.description && !autoDescription.current}
          clear
        />
      </List>
    </div>
  )
}
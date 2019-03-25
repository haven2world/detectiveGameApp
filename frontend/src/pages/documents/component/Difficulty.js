'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, Stepper, Switch} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import {toast} from '@/utils/toastUtils';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import ScrollableList from '@/component/ScrollableList'
import styles from '../document.css';
import { useInputAutoSave } from '@/utils/hookUtils';

const ListItem = List.Item;

/**
 * 剧本难度页
 */

export default function({document, updateDocument, updateSaveTime}) {


  //保存
  function save(level, key, data) {
    if(data!==undefined && document.level[level][key] !== data){
      let param = {level};
      param[key] = data;
      services.modifyDocumentLevelDetail(document._id, param).then(result=>{
        if(result && result.code === 0){
          document.level[level][key] = data;
          updateSaveTime(new Date);
        }
      })
    }
  }


  //渲染一个难度
  function renderDifficulty(level) {
    let difficulty = document.level[level];
    let titleMap = {
      easy:'简单',
      normal:'普通',
      hard:'困难'
    };
    return (
        <ListItem>
          <div className={'title-row'}>{titleMap[level]}</div>
          <div style={{ width:'100%',marginTop:10,marginBottom:5}} >
            <div className={'gray-text'}>每个人最多获取线索次数：</div>
            <div style={{paddingTop:5}}>
              <Stepper
                showNumber
                max={100}
                min={1}
                value={difficulty.maxInquiryTimes}
                onChange={(v)=>save(level, 'maxInquiryTimes', v)}
              />
            </div>
          </div>
          <div style={{ width:'100%',marginBottom:10}} className={'flex-container'}>
            <div style={{flex:1}} className={'gray-text'}>是否自动公开所有线索：</div>
            <div >
              <Switch
                checked={difficulty.keepClueSecret}
                onChange={(v)=>save(level, 'keepClueSecret',v)}
              />
            </div>
          </div>
        </ListItem>
    )
  }

  return(
    <div className={'container flex-column-container'}>
      <ScrollableList>
        {renderDifficulty('easy')}
        {renderDifficulty('normal')}
        {renderDifficulty('hard')}
      </ScrollableList>
    </div>
  )
}
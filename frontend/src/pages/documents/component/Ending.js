'use strict';
import { useState, useEffect, useRef} from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage'
import ScrollableList from '@/component/ScrollableList';
import styles from '../document.css';
import { toast } from '@/utils/toastUtils';
const ListItem = List.Item;

/**
 * 剧本结局页
 */

export default function({document, updateDocument, updateSaveTime}) {
  const btnClicked = useRef(false);

  //创建结局
  function createEnding() {
    Modal.prompt(
      '创建结局片段',
      '最终结局由符合条件的片段拼接而成',
      [
        {text:'取消'},
        {text:'创建',onPress(value){
            return new Promise((resolve, reject)=>{
              if(!value){
                toast.info('请输入一个结局片段名称');
                reject();
                return
              }
              services.createEnding(document._id, {name:value}).then(result=>{
                resolve();
                if(result && result.code === 0){
                  toast.success('创建成功！');
                  document.endings.push(result.data.ending);
                  updateSaveTime(new Date);
                }
              })
            })
          }}
      ],
      'default',
      '',
      ['给结局起个名字吧']
    );
  }

  //进入结局
  function clickRow(endingId) {
    if(btnClicked.current){
      btnClicked.current = false;
      return;
    }
    router.push('/documents/' + document._id + '/endings/' + endingId);
  }

  //复制结局
  function handleCopy(id) {
    btnClicked.current = true;
    Modal.prompt(
      '复制结局片段',
      '最终结局由符合条件的片段拼接而成',
      [
        {text:'取消'},
        {text:'复制',onPress(value){
            return new Promise((resolve, reject)=>{
              if(!value){
                toast.info('请输入一个结局片段名称');
                reject();
                return
              }
              services.copyEnding(document._id, {endingId:id, name:value}).then(result=>{
                resolve();
                if(result && result.code === 0){
                  toast.success('复制成功！');
                  document.endings.push(result.data.ending);
                  updateSaveTime(new Date);
                }
              })
            })
          }}
      ],
      'default',
      '',
      ['给结局起个名字吧']
    );
  }

  //渲染结局列表
  function renderEndingList() {
    let listView = document.endings.map((ending, index)=>(
      <ListItem key={index} onClick={()=>clickRow(ending._id)} arrow={'horizontal'}
                extra={<Button inline size={'small'} onClick={()=>handleCopy(ending._id)}>复制</Button>}>
        {ending.name}
      </ListItem>));
    return listView
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <WingBlank>
        <WhiteSpace/>
        <Button className={styles.listButton} onClick={createEnding} type={'ghost'}>新增结局片段</Button>
        <WhiteSpace/>
      </WingBlank>
      <ScrollableList>
        {renderEndingList()}
      </ScrollableList>
    </div>
  )
}
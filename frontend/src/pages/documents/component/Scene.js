'use strict';
import { useState, useEffect } from 'react';
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
 * 剧本场景页
 */

export default function({document, updateDocument, updateSaveTime}) {


  //创建场景
  function createScene() {
    Modal.prompt(
      '创建场景',
      '',
      [
        {text:'取消'},
        {text:'创建',onPress(value){
            return new Promise((resolve, reject)=>{
              if(!value){
                toast.info('请输入一个场景名称');
                reject();
                return
              }
              services.createScene(document._id, {name:value}).then(result=>{
                resolve();
                if(result && result.code === 0){
                  toast.success('创建成功！');
                  document.scenes.push(result.data.scene);
                  updateSaveTime(new Date);
                }
              })
            })
          }}
      ],
      'default',
      '',
      ['给场景起个名字吧']
    );
  }

  //进入场景
  function clickRow(sceneId) {
    router.push('/documents/' + document._id + '/scenes/' + sceneId);
  }

  //渲染场景列表
  function renderStageList() {
    let listView = document.scenes.map((scene, index)=>(
      <ListItem key={index} onClick={()=>clickRow(scene._id)} arrow={'horizontal'}>
        {scene.name}
      </ListItem>));
    return listView
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <WingBlank>
        <WhiteSpace/>
        <Button className={styles.listButton} onClick={createScene} type={'ghost'}>新增场景</Button>
        <WhiteSpace/>
      </WingBlank>
      <ScrollableList>
        {renderStageList()}
      </ScrollableList>
    </div>
  )
}
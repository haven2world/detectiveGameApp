'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import {toast} from '@/utils/toastUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import RoleList from '@/component/RoleList'
import styles from '../document.css';

/**
 * 剧本角色页
 */

export default function({document, updateDocument, updateSaveTime}) {


  //创建角色
  function createRole() {
    Modal.prompt(
      '创建角色',
      '',
      [
        {text:'取消'},
        {text:'创建',onPress(value){
            return new Promise((resolve, reject)=>{
              if(!value){
                toast.info('请输入一个角色名称');
                reject();
                return
              }
              services.createRole(document._id, {name:value}).then(result=>{
                resolve();
                if(result && result.code === 0){
                  toast.success('创建成功！');
                  document.composingStage = result.data.composingStage;
                  document.roles.push(result.data.role);
                  updateSaveTime(new Date);
                }
              })
            })
          }}
      ],
      'default',
      '',
      ['给人物起个名字吧']
    )
  }




  return(
    <div className={'container'} style={{backgroundColor:'#fff'}}>
      <List key={'button'}>
        <WingBlank>
          <WhiteSpace/>
          <Button className={styles.listButton} onClick={createRole} type={'ghost'}>新增角色</Button>
          <WhiteSpace/>
        </WingBlank>
      </List>
      <RoleList
        document={document}
        list={document.roles}
      />
    </div>
  )
}
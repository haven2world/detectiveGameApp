import { useState } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal} from 'antd-mobile';
import { Toast } from 'antd-mobile/lib/index';
import * as services from '@/utils/services';
import router from 'umi/router';

import DocumentList from '@/component/DocumentList';


function DocumentIndex({documents, dispatch}){

  //创建剧本
  function createNewDocument() {
    Modal.prompt(
      '创建剧本',
      '',
      [
        {text:'取消'},
        {text:'创建',onPress(value){
          return new Promise((resolve, reject)=>{
            if(!value){
              Toast.info('请输入一个剧本名称');
              reject();
              return
            }
            services.createDocument({name:value}).then(result=>{
              resolve();
              if(result && result.code === 0){
                Toast.success('创建成功！');
                dispatch({type:'documents/fetch'});
              }
            });
          });
        }}
      ],
      'default',
      '',
      ['给剧本起个名字吧']
    )
  }

  return(
    <div className={'container'}>
      <NavBar
        mode={'light'}
        icon={<Icon type={'left'}/>}
        onLeftClick={router.goBack}
        rightContent={<i className="fas fa-plus clickable" style={{fontSize:16 }} onClick={createNewDocument}/>}
      >你的剧本列表</NavBar>
      <DocumentList list={documents.list} loading={documents.loading} />
    </div>
  )
}
export default connect(({documents})=>({documents}))(DocumentIndex);


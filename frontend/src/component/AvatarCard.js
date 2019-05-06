'use strict';
import { useEffect, useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, ImagePicker} from 'antd-mobile';
import { RenderIf, selectFile } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import {toast} from '@/utils/toastUtils';

/**
 * 头像卡片
 */

export default function({editable, url, name, description, docId, roleId}) {
  const [image, setImage] = useState(url||require('@/assets/img/contact_default.png'));
  const [roleName, setName] = useState(name);

  useEffect(()=>{
    setImage(url||require('@/assets/img/contact_default.png'));
    setName(name);
  }, [name, url]);


  //修改头像
  async function changeAvatar() {
    if(!editable){
      return
    }
    let files = await selectFile(false, 'image/*');
    let result = await services.uploadRoleAvatar(docId, roleId, { file: files[0] });
    if (result && result.code === 0) {
      setImage(result.data.photo);
    }
  }
  //修改名字
  function changeName() {
    if(!editable){
      return
    }
    Modal.prompt(
      '修改角色名',
      '',
      [
        {text:'取消'},
        {text:'确定',onPress(value){
            return new Promise((resolve, reject)=>{
              if(!value){
                toast.info('请输入一个角色名称');
                reject();
                return
              }
              services.modifyRoleInfo(docId, roleId, { name:value }).then(result=>{
                resolve();
                if (result && result.code === 0) {
                  toast.success('保存成功！');
                  setName(value);
                }
              });
            })
          }}
      ],
      'default',
      '',
      ['给人物起个名字吧']
    )
  }
  return (<Flex style={{height:editable?200:400,backgroundColor:'#fff'}} direction={'column'} >
    <div className={editable?'clickable':''} style={{marginTop:20, display:'flex', justifyContent: 'center'}} onClick={changeAvatar} >
      <img
        src={image}
        style={{height:100,width:100,borderRadius:50, border:'2px solid #f5f5f9',objectFit:'cover'}}
      />
    </div>
    <Flex style={{flex:1}}>
      <div className={editable?'clickable':''}  onClick={changeName}>
        {roleName}
      </div>
    </Flex>
    {RenderIf(!editable)(
      <Flex style={{flex:1}}>
        <div className='gray-text' >
          {description}
        </div>
      </Flex>
    )}
  </Flex>)
}
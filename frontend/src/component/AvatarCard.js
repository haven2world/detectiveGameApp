'use strict';
import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, ImagePicker} from 'antd-mobile';
import { RenderIf, selectFile } from '@/utils/commonUtils';
import * as services from '@/utils/services';

/**
 * 头像卡片
 */

export default function({editable, url, name, docId, roleId}) {
  //文件
  const [image, setImage] = useState(url||require('@/assets/img/contact_default.png'));

  async function changeAvatar() {
    let files = await selectFile(false, 'image/*');
    services.uploadRoleAvatar(docId, roleId, {file:files[0]})
  }
  return (<Flex style={{height:200,backgroundColor:'#fff'}} direction={'column'}>
    <div className={'clickable'} style={{marginTop:20, display:'flex', justifyContent: 'center'}} onClick={changeAvatar}>
      <img
        src={image}
        style={{height:100,width:100,borderRadius:50, border:'2px solid #f5f5f9'}}
      />
    </div>
    <Flex style={{flex:1}}>
      <div>
        {name}
      </div>
    </Flex>
  </Flex>)
}
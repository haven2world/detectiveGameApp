'use strict';
import { useState, useEffect } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import AvatarCard from '@/component/AvatarCard';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';

/**
 * 角色详情页
 */
const ListItem = List.Item;
export default function({editable, roleDoc, roleId, docId, loading}) {



  //角色介绍
  const [descriptionTimer, setDescriptionTimer] = useState(null);

  //删除角色
  function deleteRole() {
    Modal.alert('提示', '确定要删除'+roleDoc.name+'吗？',[
      {text:'取消'},
      {
        text:'确定',
        onPress:()=>{
          services.deleteRoleDocument(docId, roleId).then(result=>{
            if(result && result.code === 0){
              router.goBack();
            }
          })
        }
      },
    ]);
  }

  //修改名称
  function handleChangeDescription(str){
    descriptionTimer&&clearTimeout(descriptionTimer);
    if(str){
      setDescriptionTimer(setTimeout(()=>{
        save('description', str);
      },3000));
    }
  }
  //保存
  function save(key, str) {
    if(str && roleDoc[key] !== str){
      let param = {};
      param[key] = str;
      //todo
      if(key === 'description' && roleDoc.composingStage === 'name'){
        param.composingStage = 'story';
        roleDoc.composingStage = 'story';
      }
      services.modifyRoleInfo(docId, roleId, param).then(result=>{
        if(result && result.code === 0){
          roleDoc[key] = str;
          toast.light('已保存');
        }
      })
    }
  }

  if(loading){
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >角色详情</NavBar>
        <LoadingPage/>
      </div>
    )
  }else{
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
          rightContent={<i className="fas fa-trash-alt clickable" style={{fontSize:16 }} onClick={deleteRole}/>}
        >角色详情</NavBar>
        <List>
          <ListItem>
            <AvatarCard editable={editable} roleId={roleId} docId={docId} url={roleDoc.photo} name={roleDoc.name}/>
          </ListItem>
          <ListItem>
            <TextareaItem
              placeholder="介绍一下这个角色吧"
              autoHeight
              defaultValue={roleDoc.description}
              labelNumber={3}
              onChange={handleChangeDescription}
              onBlur={str=>save('description', str)}
              clear
              editable={editable}
            />
          </ListItem>
        </List>
      </div>
    )
  }
}
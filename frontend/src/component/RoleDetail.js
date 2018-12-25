'use strict';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import AvatarCard from '@/component/AvatarCard';
import * as services from '@/utils/services';

/**
 * 角色详情页
 */
const ListItem = List.Item;
export default function({editable, name, photo, roleId, docId, loading}) {


  //删除角色
  function deleteRole() {
    Modal.alert('提示', '确定要删除'+name+'吗？',[
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
  function handleChangeName(str){
    nameTimer&&clearTimeout(nameTimer);
    setName(str);
    if(str){
      setNameTimer(setTimeout(()=>{
        save('name', str);
      },3000));
    }
  }
  //保存
  function save(key, str) {
    if(str && document[key] !== str){
      let param = {};
      param[key] = str;
      if(key === 'description' && document.composingStage === 'name'){
        param.composingStage = 'story';
        document.composingStage = 'story';
      }
      services.modifyDocumentDetail(document._id, param).then(result=>{
        if(result && result.code === 0){
          document[key] = str;
          updateSaveTime(new Date);
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
            <AvatarCard editable={editable} roleId={roleId} docId={docId} url={photo} name={name}/>
          </ListItem>
          <ListItem>
            <TextareaItem
              placeholder="介绍一下这个角色吧"
              autoHeight
            />
          </ListItem>
        </List>
      </div>
    )
  }
}
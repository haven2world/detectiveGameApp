'use strict';
import { useState, useEffect } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import AvatarCard from '@/component/AvatarCard';
import InputSelect from '@/component/InputSelect/InputSelect';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { RenderIf } from '@/utils/commonUtils';

/**
 * 角色详情页
 */
const ListItem = List.Item;
export default function({editable, roleDoc, roleId, docId, loading}) {



  //角色介绍
  const [descriptionTimer, setDescriptionTimer] = useState(null);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

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
  function save(key, data) {
    if(data && roleDoc[key] !== data){
      let param = {};
      param[key] = data;
      //todo
      if(key === 'skill' && roleDoc.composingStage === 'role'){
        param.composingStage = 'story';
        roleDoc.composingStage = 'story';
      }
      services.modifyRoleInfo(docId, roleId, param).then(result=>{
        if(result && result.code === 0){
          roleDoc[key] = data;
          toast.light('已保存');
        }
      })
    }
  }

  //新增技能
  function addSkill(){

  }

  //关闭modal
  function closeModal(){
    setSkillModalVisible(false);
    setNewSkillName('');
  }

  //渲染新增技能modal
  function renderSkillModal() {
    const footerBtn = [
      {text:'取消',onPress:closeModal},
      {text:'创建',onPress:addSkill}
    ];
    return(<Modal
      visible={skillModalVisible}
      transparent
      closable
      onClose={closeModal}
      title={'新增技能'}
      footer={footerBtn}
    >
      <InputSelect
        onChange={(value)=>{console.log(value);setNewSkillName(value)}}
        list={['test','ttes','testt']}
      />
    </Modal>)
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
            <div className={'title-row'}>简介</div>
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
          <ListItem>
            <div className={'title-row'}>技能
              <span className={'gray-text subtitle'}>共&nbsp;{roleDoc.skills.length}</span>
              {RenderIf(editable)(
                <span className={'pull-right clickable'} onClick={()=>setSkillModalVisible(true)}>新增</span>
              )}
            </div>
          </ListItem>

        </List>
        {renderSkillModal()}
      </div>
    )
  }
}
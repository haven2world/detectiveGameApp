'use strict';
import { useState, useEffect } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import AvatarCard from '@/component/AvatarCard';
import InputSelect from '@/component/InputSelect/InputSelect';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { isInArray, RenderIf } from '@/utils/commonUtils';
import { useInputAutoSave } from '@/utils/hookUtils';

/**
 * 角色详情页
 */
const ListItem = List.Item;
export default function({editable, roleDoc, roleId, docId, loading}) {

  const [roleDetail, setRoleDetail] = useState(null);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(()=>{
    if(roleDoc){
      setRoleDetail(roleDoc);
    }
  },[roleDoc]);

  //删除角色
  function deleteRole() {
    Modal.alert('提示', '确定要删除'+roleDetail.name+'吗？',[
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

  //保存
  function save(key, data) {
    if(data && roleDetail[key] !== data){
      let param = {};
      param[key] = data;
      services.modifyRoleInfo(docId, roleId, param).then(result=>{
        if(result && result.code === 0){
          let temp = {...roleDetail};
          temp[key] = data;
          setRoleDetail(temp);
          toast.light('已保存');
        }
      })
    }
  }

  //新增技能
  function addSkill(){
    if(!newSkillName){
      toast.info('请输入技能名');
      return;
    }
    if(roleDetail.skills.find(skill=>skill.skillInfo.name === newSkillName)){
      toast.info('请不要使用重复的技能名');
      return;
    }
    services.createSkill({name:newSkillName, docId, roleId}).then(result=>{
      if(result && result.code === 0){
        let temp = {...roleDetail};
        temp.skills.push(result.data.skill);
        if(!isInArray(newSkillName, temp.allSkills)){
          temp.allSkills.push(newSkillName);
        }
        setRoleDetail(temp);
        toast.light('已创建');
      }
      closeModal();
    });
  }

  //关闭modal
  function closeModal(){
    setSkillModalVisible(false);
    setNewSkillName('');
  }

  //删除技能
  function onDelete(roleSkillId){
    let temp = {...roleDetail};
    temp.skills = temp.skills.filter(skill=>skill._id!==roleSkillId);
    setRoleDetail(temp);
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
      <div style={{paddingBottom:5}}>技能名</div>
      <InputSelect
        onChange={(value)=>{setNewSkillName(value)}}
        list={roleDetail.allSkills}
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
    //角色介绍
    const autoDescription = useInputAutoSave(str=>save('description',str), roleDetail.description);

    return (
      <div className={'container  flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
          rightContent={<i className="fas fa-trash-alt clickable" style={{fontSize:16 }} onClick={deleteRole}/>}
        >角色详情</NavBar>
        <ScrollableList>
          <ListItem>
            <AvatarCard editable={editable} roleId={roleId} docId={docId} url={roleDetail.photo} name={roleDetail.name}/>
          </ListItem>
          <ListItem>
            <div className={'title-row'}>简介</div>
          </ListItem>
          <ListItem>
            <TextareaItem
              placeholder="介绍一下这个角色吧"
              autoHeight
              labelNumber={3}
              editable={editable}
              clear
              {...autoDescription}
            />
          </ListItem>
          <ListItem>
            <div className={'title-row'}>技能
              <span className={'gray-text subtitle'}>共&nbsp;{roleDetail.skills.length}</span>
              {RenderIf(editable)(
                <span className={'pull-right clickable primary-text'} onClick={()=>setSkillModalVisible(true)}>新增</span>
              )}
            </div>
          </ListItem>
          {roleDetail.skills.map((skill, index)=>{
            let info = skill.skillInfo;
            return <SkillItem
              key={index}
              name={info.name}
              description={info.description}
              count={skill.maxCount}
              roleId={roleId}
              docId={docId}
              skillId={info._id}
              roleSkillId={skill._id}
              editable={editable}
              onDelete={onDelete}
            />
          })}
        </ScrollableList>
        {renderSkillModal()}
      </div>
    )
  }
}

function SkillItem({name, description, count, editable, roleId, skillId, docId, roleSkillId, onDelete}) {

  const autoName = useInputAutoSave(saveName, name);
  const autoDescription = useInputAutoSave(saveDescription, description);
  const [_count, setCount] = useState(count||0);
  const [visible, setVisible] = useState(true);

  const baseParam = {roleId, docId};

  function saveName(name) {
    services.modifySkill(skillId, {...baseParam, name}).then(result=>{
      if(result && result.code === 0){
        toast.light('已保存');
      }
    })
  }

  function saveDescription(description) {
    services.modifySkill(skillId, {...baseParam, description}).then(result=>{
      if(result && result.code === 0){
        toast.light('已保存');
      }
    })
  }

  function saveCount(value) {
    setCount(value);
    services.modifySkill(skillId, {...baseParam, count:value}).then(result=>{
      if(result && result.code === 0){
        toast.light('已保存');
      }
    })
  }

  function deleteSkill() {
    services.deleteSkill(docId, roleId, roleSkillId).then(result=>{
      if(result && result.code === 0){
        toast.light('已删除');
        setVisible(false);
        onDelete(roleSkillId);
      }
    })
  }

  if(visible){
    return <ListItem>
      <div>
        <span className={'gray-text'}>名称：</span>
        <InputItem {...autoName} editable={editable}/>
      </div>
      <div>
        <span className={'gray-text'}>效果：</span>
        <InputItem {...autoDescription} editable={editable} placeholder="描述一下这个技能"/>
      </div>
      <div>
        <span className={'gray-text'}>最大使用次数：</span>
        <ListItem>
          <span style={{marginRight:10, width:80, display:'inline-block'}}>{_count||'无限次'}</span>
          {RenderIf(editable)(
            <Stepper min={0} value={_count} onChange={saveCount} showNumber={false} style={{ width: 80}}/>
          )}
        </ListItem>
      </div>
      <div className={'primary-text'} style={{position:'absolute', right: 20, top: 5, zIndex:100}}>
        <i className="fas fa-trash-alt clickable" style={{fontSize:16 }} onClick={deleteSkill}/>
      </div>
    </ListItem>
  }else{
    return null;
  }
}
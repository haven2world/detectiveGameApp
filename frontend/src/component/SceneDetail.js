'use strict';
import { useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper, Switch, Picker } from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { isInArray, RenderIf } from '@/utils/commonUtils';
import { useInputAutoSave } from '@/utils/hookUtils';

const ListItem = List.Item;
/**
 * 场景详情页
 */

export default function({editable=false, sceneDoc, sceneId, docId, loading}) {

  const [sceneDetail, setSceneDetail] = useState(null);
  const allSkills = useRef([]);

  useEffect(()=>{
    if(sceneDoc){
      setSceneDetail(sceneDoc);
      allSkills.current = formatAllSkills(sceneDoc.allSkills);
    }
  },[sceneDoc]);

  //删除角色
  function deleteScene() {
    Modal.alert('提示', '确定要删除'+sceneDetail.name+'吗？',[
      {text:'取消'},
      {
        text:'确定',
        onPress:()=>{
          services.deleteSceneDocument(docId, sceneId).then(result=>{
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
    if(data && sceneDetail[key] !== data){
      let param = {};
      param[key] = data;
      services.modifySceneInfo(docId, sceneId, param).then(result=>{
        if(result && result.code === 0){
          let temp = {...sceneDetail};
          temp[key] = data;
          setSceneDetail(temp);
          toast.light('已保存');
        }
      })
    }
  }

  //修改生效阶段
  function onChangeStage(value) {
    let temp = {...sceneDetail};
    temp.enableStage = value;
    setSceneDetail(temp);
    save('enableStage',value);
  }

  //新增线索
  function addClue(){
    services.createClue(docId,sceneId).then(result=>{
      if(result.code === 0){
        let temp = {...sceneDetail};
        temp.clues.push(result.data.clue);
        setSceneDetail(temp);
        toast.light('已创建');
      }
    })
  }

  //删除线索
  function onDelete(clueId){
    let temp = {...sceneDetail};
    temp.clues = temp.clues.filter(clue=>clue._id!==clueId);
    setSceneDetail(temp);
  }

  //整理技能
  function formatAllSkills(skills) {
    return skills.map(skill=>({label:skill.name,value:skill._id}))
  }


  if(loading){
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >场景详情</NavBar>
        <LoadingPage/>
      </div>
    )
  }else{
    //自动保存hook
    const autoName = useInputAutoSave(str=>save('name',str), sceneDetail.name);

    return (
      <div className={'container flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
          rightContent={RenderIf(editable)(<i className="fas fa-trash-alt clickable" style={{fontSize:16 }} onClick={deleteScene}/>)}
        >场景详情</NavBar>
        <ScrollableList>
          <ListItem>
            <div className={'title-row'}><InputItem
              placeholder='场景名'
              editable={editable}
              clear
              {...autoName}
            >名称</InputItem></div>
          </ListItem>
          <ListItem extra={editable?
            <Stepper
              style={{ width: '100%', minWidth: '100px' }}
              showNumber
              max={sceneDetail.maxStageCount}
              min={1}
              value={sceneDetail.enableStage}
              onChange={onChangeStage}
            />:<div>第{sceneDetail.enableStage}阶段</div>
          }>
            <div className={'title-row'}>生效阶段</div>
          </ListItem>
          <ListItem>
            <div className={'title-row'}>线索
              <span className={'gray-text subtitle'}>共&nbsp;{sceneDetail.clues.length}&nbsp;条</span>
              {RenderIf(editable)(
                <span className={'pull-right clickable primary-text'} onClick={()=>addClue()}>新增</span>
              )}
            </div>
          </ListItem>
          {sceneDetail.clues.map((clue, index)=>{
            return <ClueItem
              key={index}
              index={index}
              clue={clue}
              maxStage={sceneDetail.maxStageCount}
              allSkills={allSkills.current}
              sceneId={sceneId}
              docId={docId}
              clueId={clue._id}
              editable={editable}
              onDelete={onDelete}
            />
          })}
        </ScrollableList>
      </div>
    )
  }
}

function ClueItem({index, clue, maxStage, allSkills, editable, sceneId, clueId, docId, onDelete}) {

  const autoName = useInputAutoSave((value)=>save('name',value), clue.name);
  const autoContent = useInputAutoSave((value)=>save('content',value), clue.content);
  const autoSkillContent = useInputAutoSave((value)=>save('contentForSkill',value), clue.contentForSkill);
  const [clueDetail,setClue] = useState(clue);

  //保存
  function save(key, data) {
    if(data!== undefined && clueDetail[key] !== data){
      let param = {};
      param[key] = data;
      services.modifyClueInfo(docId, sceneId, clueId, param).then(result=>{
        if(result && result.code === 0){
          let temp = {...clueDetail};
          temp[key] = data;
          setClue(temp);
          toast.light('已保存');
        }
      })
    }
  }


  function deleteClue() {
    services.deleteClue(docId, sceneId, clueId).then(result=>{
      if(result && result.code === 0){
        toast.light('已删除');
        onDelete(clueId);
      }
    })
  }

  const style = index?{border:'0 solid #2c8ae9',borderTopWidth:'1px'}:{};

  return (<ListItem style={style} wrap>
    <div>
      <span className={'gray-text'}>线索&nbsp;{index+1}：{RenderIf(clueDetail.gameStatus)(clueDetail.gameStatus&&clueDetail.gameStatus.shared?'【已公开】':'【未公开】')}</span>
      <InputItem {...autoName} editable={editable} placeholder={'输入线索名称'}/>
    </div>
    {RenderIf(clueDetail.gameStatus)(
      <div style={{width:'100%'}} className={'free-break'}>
        <span className={'gray-text'}>持有人：&nbsp;</span>
        <span>{clueDetail.gameStatus&&clueDetail.gameStatus.shared?'所有人':clueDetail.gameStatus&&clueDetail.gameStatus.founder.map(i=>i.name).join(',')}</span>
      </div>
    )}
    <div>
      <span className={'gray-text'}>内容：</span>
      <TextareaItem
        placeholder="描述一下这个线索"
        autoHeight
        labelNumber={3}
        editable={editable}
        {...autoContent}
      />
    </div>
    <div style={{ width:'100%'}} className={'flex-container'}>
      <div style={{flex:1}} className={'gray-text'}>生效阶段：</div>
      <div >
        {RenderIf(editable)(<Stepper
        showNumber
        max={clueDetail.maxStageCount}
        min={1}
        value={clueDetail.enableStage}
        onChange={(v)=>save('enableStage',v)}
      />)}
        {RenderIf(!editable)(<div className={'gray-text'}>第{clueDetail.enableStage}阶段</div>)}
      </div>
    </div>
    {RenderIf(editable)(
      <div style={{ width: '100%' }} className={'flex-container'}>
        <div style={{ flex: 1 }} className={'gray-text'}>可被重复获取：</div>
        <div>
          <Switch
            checked={clueDetail.repeatable}
            onChange={(v) => save('repeatable', v)}
          />
        </div>
      </div>)}
    {RenderIf(editable)(
      <div style={{ width:'100%',marginTop:5}} className={'flex-container'}>
        <div style={{flex:1}} className={'gray-text'}>需要技能：</div>
        <div>
          <Switch
            checked={clueDetail.needSkill}
            onChange={(v)=>save('needSkill',v)}
          />
        </div>
      </div>)}
    {RenderIf(clueDetail.needSkill)(
      <div style={{width:'100%'}}>
        <div style={{ width:'100%',marginTop:5}} className={'flex-container'}>
          <div className={'gray-text flex-column-container flex-center'} >{!editable?'需要':''}技能：</div>
          <div style={{flex:1}}>
            <Picker
              data={allSkills}
              value={[clueDetail.skillId]}
              cols={1}
              onOk={(v)=>save('skillId',v[0])}
              title={'请选择需要的技能'}
              disabled={!editable}
            ><List.Item>&nbsp;</List.Item></Picker>
          </div>
        </div>
        <div>
          <span className={'gray-text'}>隐藏线索内容：</span>
          <TextareaItem
            placeholder="描述一下线索"
            autoHeight
            labelNumber={3}
            editable={editable}
            {...autoSkillContent}
          />
        </div>
      </div>
    )}
    {RenderIf(editable)(
    <div className={'primary-text'} style={{ position: 'absolute', right: 20, top: 5, zIndex: 100 }}>
      <i className="fas fa-trash-alt clickable" style={{ fontSize: 16 }} onClick={deleteClue}/>
    </div>)}

  </ListItem>)

}

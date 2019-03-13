'use strict';

import { useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import StoryEditor from '@/component/StoryEditor/StoryEditor';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { changeQuery, isInArray, RenderIf } from '@/utils/commonUtils';

const ListItem = List.Item;

/**
 * 剧本故事列表
 */

export default function({computedMatch,location:{query}}) {
  const {id:docId} = computedMatch.params;
  const stageCount = Number(computedMatch.params.stageCount);
  const {role} = query;

  const [stories, setStories] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState(null);

  //初始化
  useEffect(()=>{
    updateStories();
  },[]);


  //获取角色故事列表
  function updateStories(){
    setLoading(true);
    services.fetchStoriesInStage(docId, stageCount).then(result=>{
      if(result && result.code === 0){
        if(role){
          setRoleData(result.data.stories.find(item=>item._id===role));
        }
        setStories(result.data.stories);
        setLoading(false);
      }
    })
  }

  //点击故事
  function clickStory(role){
    let searchString = '?role=' + role._id;
    changeQuery(searchString);
    setRoleData(role);
  }

  //关闭编写页面
  function closeEditor() {
    changeQuery('');
    setRoleData(null);
  }

  //渲染角色列表
  function renderList() {
    return stories.map((role,index)=>{
      let brief = role.story?role.story.content.replace(/<[^>]+>/g,'').slice(0,10)+'...' : '尚未编写故事';
      return (
        <ListItem key={index} wrap onClick={() => clickStory(role)} arrow={'horizontal'}
              thumb={<img
                src={role.photo ? role.photo : require('@/assets/img/contact_default.png')}
                style={{ height: 50, width: 50, borderRadius: 25, border: '1px solid #f5f5f9', objectFit: 'cover', }}
              />}
        >
          {role.name}
          <ListItem.Brief>
            {brief}</ListItem.Brief>
        </ListItem>);
    });
  }

  if(stories){
    if(roleData){
      return <StoryEditorPage
        docId={docId}
        role={roleData}
        closeEditor={closeEditor}
        stageCount={stageCount}
      />
    }else{
      return (
        <div className={'container flex-column-container'}>
          <NavBar
            mode={'light'}
            icon={<Icon type={'left'}/>}
            onLeftClick={router.goBack}
          >第{stageCount+1}阶段</NavBar>
          <ScrollableList>
            {renderList()}
          </ScrollableList>
        </div>
      )
    }

  }else{
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >第{stageCount+1}阶段</NavBar>
        <LoadingPage/>
      </div>
    )
  }

}

function StoryEditorPage({role, closeEditor, stageCount, docId}) {

  function saveStory(data) {
    if(role.story && role.story._id){
      services.modifyStory(docId, role.story._id, {content:data}).then(result=>{
        if(result && result.code ===0){
          role.story.content = data;
          toast.light('保存成功');
        }
      });
    }else{
      services.createStory(docId,{roleId: role._id, stageCount, content:data}).then(result=>{
        if(result && result.code ===0){
          role.story = result.data.story;
          console.log(role.story)
          toast.light('保存成功');
        }
      });
    }
  }
  
  return (
    <div className={'container flex-column-container'}>
      <NavBar
        mode={'light'}
        icon={<Icon type={'left'}/>}
        onLeftClick={closeEditor}
      >{role.name} - 第{stageCount+1}阶段</NavBar>
      <StoryEditor
        story={role.story}
        saveStory={saveStory}
      />
    </div>
  )
}



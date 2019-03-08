'use strict';

import { useState, useEffect } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import AvatarCard from '@/component/AvatarCard';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { isInArray, RenderIf } from '@/utils/commonUtils';

/**
 * 剧本故事列表
 */

export default function({computedMatch}) {
  const {id:docId} = computedMatch.params;
  const stageCount = Number(computedMatch.params.stageCount);

  const [stories, setStories] = useState(undefined);
  const [loading, setLoading] = useState(false);

  //初始化
  useEffect(()=>{
    updateStories();
  },[]);


  //获取角色详情
  function updateStories(){
    setLoading(true);
    services.fetchStoriesInStage(docId, stageCount).then(result=>{
      if(result && result.code === 0){
        setStories(result.data.stories);
        setLoading(false);
      }
    })
  }

  return (
    <div className={'container'}>
      <NavBar
        mode={'light'}
        icon={<Icon type={'left'}/>}
        onLeftClick={router.goBack}
      >第{stageCount+1}阶段</NavBar>

    </div>
  )
}

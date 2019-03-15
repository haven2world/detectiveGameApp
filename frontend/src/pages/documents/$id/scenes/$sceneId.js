'use strict';

import { useState, useEffect } from 'react';
import SceneDetail from '@/component/SceneDetail';
import * as services from '@/utils/services';

/**
 * 剧本场景详情
 */

export default function({computedMatch, role}) {
  const {id:docId, sceneId} = computedMatch.params;

  const [sceneDoc, setSceneDoc] = useState(undefined);
  const [loading, setLoading] = useState(false);

  //初始化
  useEffect(()=>{
    updateScene();
  },[]);


  //获取场景详情
  function updateScene(){
    setLoading(true);
    services.fetchSceneDetail(docId, sceneId).then(result=>{
      if(result && result.code === 0){
        let sceneDoc = result.data.scene;
        sceneDoc.maxStageCount = result.data.storyStageCount;
        sceneDoc.allSkills = result.data.allSkills;
        setSceneDoc(sceneDoc);
        setLoading(false);
      }
    })
  }


  return <SceneDetail
    editable
    docId={docId}
    sceneId={sceneId}
    loading={loading || !sceneDoc}
    sceneDoc={sceneDoc}
    updateScene={updateScene}
  />
}
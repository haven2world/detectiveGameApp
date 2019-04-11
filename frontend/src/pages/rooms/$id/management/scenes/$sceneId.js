'use strict';

import { useState, useEffect } from 'react';
import SceneDetail from '@/component/SceneDetail';
import * as services from '@/utils/services';

/**
 * 剧本场景详情
 */

export default function({computedMatch}) {
  const {id:gameId, sceneId} = computedMatch.params;

  const [sceneDoc, setSceneDoc] = useState(undefined);
  const [loading, setLoading] = useState(false);

  //初始化
  useEffect(()=>{
    updateScene();
  },[]);


  //获取场景详情
  function updateScene(){
    setLoading(true);
    services.fetchPlayingSceneDetail(gameId, sceneId).then(result=>{
      if(result && result.code === 0){
        let sceneDoc = result.data.scene;
        sceneDoc.allSkills = result.data.allSkills;
        setSceneDoc(sceneDoc);
        setLoading(false);
      }
    })
  }


  return <SceneDetail
    sceneId={sceneId}
    loading={loading || !sceneDoc}
    sceneDoc={sceneDoc}
  />
}
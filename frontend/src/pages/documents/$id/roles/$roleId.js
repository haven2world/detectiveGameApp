'use strict';

import { useState, useEffect } from 'react';
import RoleDetail from '@/component/RoleDetail';
import * as services from '@/utils/services';

/**
 * 剧本角色详情
 */

export default function({computedMatch, role}) {
  const {id:docId, roleId} = computedMatch.params;

  const [roleDoc, setRoleDoc] = useState(undefined);
  const [loading, setLoading] = useState(false);

  //初始化
  useEffect(()=>{
    if(!roleDoc && !loading){
      updateRole();
    }
  });


  //获取角色详情
  function updateRole(){
    setLoading(true);
    services.fetchRoleDocument(docId, roleId).then(result=>{
      if(result && result.code === 0){
        setRoleDoc(result.data.role);
      }
      setLoading(false);
    })
  }


  return <RoleDetail
    editable
    docId={docId}
    roleId={roleId}
    loading={loading || !roleDoc}
    name={roleDoc?roleDoc.name:''}
    photo={roleDoc?roleDoc.photo:undefined}
  />
}
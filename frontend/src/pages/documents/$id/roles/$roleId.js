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
    updateRole();
  },[]);


  //获取角色详情
  function updateRole(){
    setLoading(true);
    services.fetchRoleDocument(docId, roleId).then(result=>{
      if(result && result.code === 0){
        let roleDoc = result.data.role;
        roleDoc.allSkills = result.data.skills.map(skill=>skill.name);
        setRoleDoc(roleDoc);
        setLoading(false);
      }
    })
  }


  return <RoleDetail
    editable
    docId={docId}
    roleId={roleId}
    loading={loading || !roleDoc}
    roleDoc={roleDoc}
    updateRole={updateRole}
  />
}
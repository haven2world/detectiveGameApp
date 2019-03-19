'use strict';

import { useState, useEffect, useRef } from 'react';
import TaskDetail from '@/component/TaskDetail'
import * as services from '@/utils/services';

/**
 * 剧本任务列表
 */

export default function({computedMatch}) {
  const {id:docId, roleId} = computedMatch.params;

  const [tasks, setTasks] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const roleName = useRef('');

  //初始化
  useEffect(()=>{
    updateTask();
  },[]);


  //获取任务列表
  function updateTask(){
    setLoading(true);
    services.fetchTaskList(docId, roleId).then(result=>{
      if(result && result.code === 0){
        let tasks = result.data.tasks;
        roleName.current = result.data.roleName;
        setTasks(tasks);
        setLoading(false);
      }
    })
  }


  return <TaskDetail
    editable
    docId={docId}
    roleId={roleId}
    loading={loading || !tasks}
    tasks={tasks}
    roleName={roleName.current}
    updateTask={updateTask}
  />
}
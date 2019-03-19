'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import RoleList from '@/component/RoleList'
import ScrollableList from '@/component/ScrollableList';
import styles from '../document.css';
import { toast } from '@/utils/toastUtils';
const ListItem = List.Item;

/**
 * 剧本任务页
 */

export default function({document, updateDocument, updateSaveTime}) {

  //进入角色任务详情
  function clickRow(role) {
    router.push('/documents/' + document._id + '/tasks/roles/' + role._id);
  }

  return(
    <div className={'flex-column-container container'} style={{backgroundColor:'#fff'}}>
      <RoleList
        document={document}
        list={document.roles}
        onClickRow={clickRow}
      />
    </div>
  )
}
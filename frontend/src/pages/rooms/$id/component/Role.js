'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import {toast} from '@/utils/toastUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import RoleList from '@/component/RoleList'
import styles from '../document.css';

/**
 * 房主角色页
 */

export default function({game, updateGame}) {


  return(
    <div className={'container flex-column-container'} style={{backgroundColor:'#fff'}}>
      <RoleList
        document={game.document}
        game={game}
        list={game.document.roles}
      />
    </div>
  )
}
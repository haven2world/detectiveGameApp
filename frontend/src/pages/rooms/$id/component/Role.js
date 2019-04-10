'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import {toast} from '@/utils/toastUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import RoleList from '@/component/RoleList'

/**
 * 房主角色页
 */

export default function({game, updateGame}) {

  useEffect(()=>{
    let roleDoc = game.document.roles;
    let roleMap = {};
    roleDoc.forEach(role=>roleMap[role._id] = role);
    let playerMap = {};
    game.players.forEach(player=>playerMap[player._id] = player);
    game.roles.forEach((role, index, arr)=>{
      arr[index] = {...roleMap[role.roleDocumentId], ...role, player:playerMap[role.player].loginId};
    });
  }, [game]);

  return(
    <div className={'container flex-column-container'} style={{backgroundColor:'#fff'}}>
      <RoleList
        document={game.document}
        game={game}
        list={game.roles}
      />
    </div>
  )
}
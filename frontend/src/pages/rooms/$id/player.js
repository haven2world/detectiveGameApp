'use strict';
import { useState, useEffect } from 'react';
import {connect} from 'dva';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import {toast} from '@/utils/toastUtils';
import * as services from '@/utils/services';
import router from 'umi/router';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';

const ListItem = List.Item;

/**
 * 游戏页面
 */
export default function({computedMatch}) {
  const {id:gameId} = computedMatch.params;

  return <div>
    <NavBar
      mode={'light'}
      icon={<Icon type={'left'}/>}
      onLeftClick={router.goBack}
    >play</NavBar>
  </div>
}
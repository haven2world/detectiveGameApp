import React,{useEffect, useState, useContext} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import playerActions from '@/constant/playerActions';

const ListItem = List.Item;

/**
 * 游戏主界面
 */

export default function(props) {
  const ctx = useContext(Player.Context);

  //初始化数据
  useEffect(()=>{
    ctx.actions(playerActions.INIT_GAME)
  },[]);

  return (
    <div>
      <NavBar
        mode={'light'}
        icon={<Icon type={'left'}/>}
        onLeftClick={router.goBack}
      >play</NavBar>
    </div>);
}
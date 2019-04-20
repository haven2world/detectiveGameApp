import React,{useEffect, useState, useContext} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import playerActions from '@/constant/playerActions';
import gameStatus from '@/constant/gameStatus';
import styles from './player.css';

/**
 * 阶段故事显示
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, currentStage} = ctx.store;

  return (<div className={classnames(['container', styles.storyContainer])}>

  </div>)
}
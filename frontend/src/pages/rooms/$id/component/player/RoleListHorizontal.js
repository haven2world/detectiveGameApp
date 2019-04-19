import React,{useEffect, useState, useContext} from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import styles from './player.css';

import Player from '../../player';

/**
 * 横向的角色头像列表
 */

export default function() {
  const ctx = useContext(Player.Context);
  const {game} = ctx.store;

  return (<div className={styles.roleList}>
    {game}
  </div>);
}

function avator() {

  return (
    <div>
      <img
        src={image}
        style={{height:30,width:30,borderRadius:15, border:'1px solid #f5f5f9',objectFit:'cover'}}
      />
    </div>
  )
}
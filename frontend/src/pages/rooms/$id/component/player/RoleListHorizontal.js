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
    {game.roles.map(role=><Avatar image={role.document.image} name={role.document.name} />)}
  </div>);
}

function Avatar({image, name}) {

  return (
    <div className={styles.avatarWrapper}>
      <img
        src={image}
        style={{height:40,width:40,borderRadius:20, border:'1px solid #f5f5f9',objectFit:'cover'}}
      />
      <div >{name}</div>
    </div>
  )
}
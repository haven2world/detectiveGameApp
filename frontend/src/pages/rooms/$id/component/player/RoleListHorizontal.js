import React,{useEffect, useState, useContext} from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import styles from './player.css';
import gameViewActions from '@/constant/gameViewActions';
import Player from '../../player';

/**
 * 横向的角色头像列表
 */

export default function({setContentView}) {
  const ctx = useContext(Player.Context);
  const {game} = ctx.store;

  //点击头像
  function onClickRole(index) {
    ctx.dispatch({type:gameViewActions.SET_ROLE_SHOWN, data:{role:game.roles[index]}});
    setContentView('role');
  }

  return (<div className={styles.roleList}>
      {game.roles.map((role, index)=><Avatar
        image={role.document.photo}
        name={role.document.name}
        key={role._id}
        index={index}
        onClickRole={onClickRole}
      />)}
  </div>);
}

function Avatar({image, name, onClickRole, index}) {
  return (
    <div className={classnames([styles.avatarWrapper, 'clickable'])} onClick={()=>{onClickRole(index)}}>
      <img
        src={image||require('@/assets/img/contact_default.png')}
        style={{height:40,width:40,borderRadius:20, border:'1px solid #f5f5f9',objectFit:'cover'}}
      />
      <div >{name}</div>
    </div>
  )
}
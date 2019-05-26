import React,{useEffect, useState, useContext, useRef} from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import styles from './player.css';
import gameViewActions from '@/constant/gameViewActions';
import Player from '../../player';
import { RenderIf } from '@/utils/commonUtils';

/**
 * 横向的角色头像列表
 */

export default function({contentView, setContentView}) {
  const ctx = useContext(Player.Context);
  const {game, shownRowDetail} = ctx.store;
  const [sortedRoles, setRoles] = useState([]);

  //监测数据变化
  useEffect(()=>{
    setRoles(sortRoles());
  },[game.roles]);

  //点击头像
  function onClickRole(role) {
    ctx.dispatch({type:gameViewActions.SET_ROLE_SHOWN, data:{role:role}});
    setContentView('role');
  }

  //对头像排序
  function sortRoles() {
    let result = [];
    game.roles.forEach(role=>{
      if(role.sharedClues){
        result.unshift(role);
      }else{
        result.push(role);
      }
    });
    return result;
  }

  return (<div className={styles.roleList}>
    <div className={styles.roleListContainer}>
      { sortedRoles.map((role, index)=><Avatar
        image={role.document.photo}
        name={role.document.name}
        key={role._id}
        role={role}
        isChosen={contentView==='role'&&shownRowDetail===role}
        onClickRole={onClickRole}
      />)}
    </div>
  </div>);
}

function Avatar({image, name, onClickRole, role, isChosen}) {
  return (
    <div className={classnames([styles.avatarWrapper, 'clickable'])} onClick={()=>{onClickRole(role)}}>
      <img
        src={image||require('@/assets/img/contact_default.png')}
        className={styles.roleImg}
      />
      {RenderIf(isChosen)(
        <div className={styles.roleTriangle}>

        </div>
      )}
    </div>
  )
}
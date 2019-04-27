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
import managerActions from '@/constant/managerActions';

const ListItem = List.Item;

/**
 * 选择角色页
 */

export default function({computedMatch}) {
  const {id:gameId} = computedMatch.params;

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  //初始化数据
  useEffect(()=>{
    updateGame();
  },[]);

  //获取剧本详情
  function updateGame(){
    setLoading(true);
    services.fetchGameDetail(gameId).then(result=>{
      if(result && result.code === 0){
        let data = result.data.game;
        let roleMap = {};
        data.roles.forEach(role=>roleMap[role.roleDocumentId] = role);
        let playerMap = {};
        data.players.forEach(player=>playerMap[player._id] = player);
        data.document.roles.forEach((role, index, arr)=>{
          if(roleMap[role._id]){
            arr[index] = {...role, player:playerMap[roleMap[role._id].player].loginId};
          }
        });
        setGame(result.data.game);
        setLoading(false);
      }
    })
  }

  return (
    <div className={'container'}>
      <NavBar
        mode={'light'}
        icon={<Icon type={'left'}/>}
        onLeftClick={()=>router.replace('/rooms')}
      >选择角色</NavBar>
      <div className={'container flex-column-container'} style={{ backgroundColor: '#fff' }}>
        <RoleList
          loading={loading}
          game={game}
        />
      </div>
    </div>
  );


}

function RoleList(props) {
  const {loading, game} = props;
  let document = game?game.document:null;


  //点击行
  function clickDocument(role) {
    if(role.player){
      toast.info('当前角色已经有人扮演啦');
    }else{
      Modal.alert('提示',<div>确定扮演<strong className='primary-text'>{role.name}</strong>吗?<br/>(一旦确认<strong className={'error-text'}>无法更改</strong>)</div>,[
        {text:'取消'},
        {text:'确认',onPress:()=>{
            services.joinGameWithRole(game._id, role._id).then(result=>{
              if(result && result.code === 0){
                sessionStorage.setItem('playerGameId', game._id);
                router.replace('/rooms/' + game._id + '/player');
              }
            });
        }}
      ])
    }
  }
  if(loading){
    return <LoadingPage/>
  }
  if(document.roles.length>0){
    return (
      <ScrollableList>
        {document.roles.map((role, index) => {
          let desc = role.description || '暂无描述';
          if(role.player){
            desc = '扮演者：' + role.player;
          }
          return <ListItem key={index} wrap onClick={() => clickDocument(role)} arrow={role.player?null:'horizontal'}
                       thumb={<img
                         src={role.photo ? role.photo : require('@/assets/img/contact_default.png')}
                         style={{ height: 50, width: 50, borderRadius: 25, border: '1px solid #f5f5f9', objectFit: 'cover', }}
                       />}
          >
            {role.name}
            <ListItem.Brief>{desc}</ListItem.Brief>
          </ListItem>;
        })}
      </ScrollableList>
    )
  }
}

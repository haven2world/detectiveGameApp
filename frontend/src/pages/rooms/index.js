'use strict';

import { useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper, Checkbox} from 'antd-mobile';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import * as services from '@/utils/services';
import { toast } from '@/utils/toastUtils';
import { changeQuery, isInArray, RenderIf } from '@/utils/commonUtils';

const ListItem = List.Item;

/**
 * 房间列表
 */

export default function({computedMatch}) {

  const [games, setGames] = useState(undefined);
  const [loading, setLoading] = useState(true);

  //初始化
  useEffect(()=>{
    updateGameList();
  },[]);


  //获取房间列表
  function updateGameList(){
    setLoading(true);
    services.getAllGamesUnfinished().then(result=>{
      if(result && result.code === 0){
        setGames(result.data.games);
        setLoading(false);
      }
    })
  }

  //选择房间
  function clickRow(game) {
    router.replace('/rooms/' + game._id + '/roles');
  }

  if(loading){
    return (
      <div className={'container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >加载中...</NavBar>
        <LoadingPage/>
      </div>
    )
  }else{
    return (
      <div className={'container  flex-column-container'}>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >选择游戏房间</NavBar>
        <ScrollableList>
          {games.map(game=><ListItem key={game._id} wrap onClick={()=>clickRow(game)} arrow={'horizontal'}>
            {game.document.name}
            <ListItem.Brief>
              <div className={game.roles.length!==game.document.roles.length?'success-text':''}>{game.roles.length}/{game.document.roles.length}</div>
              {game.document.description}
              </ListItem.Brief>
          </ListItem>)}
        </ScrollableList>
      </div>
    )
  }
}
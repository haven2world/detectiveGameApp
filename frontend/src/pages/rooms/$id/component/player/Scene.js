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
import SearchOverView from './SearchOverView';
import * as services from '@/utils/services';

const ListItem = List.Item;

/**
 * 搜证场景显示
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, currentStage} = ctx.store;

  //搜证
  function comb(scene) {
    ctx.actions(playerActions.COMB_SCENE, {sceneId:scene._id}).then(result=>{
      if(result && result.code === 0){
        Modal.alert('线索', <div>{result.data.clueInstance.document.content}</div>,[
          {text:'知道了'},
        ]);
      }
    });
  }

  //渲染场景列表
  function renderScenes() {
    return game.document.scenes.map(scene=>{
      let searchBtn = <Button type='primary' size='small' disabled={!scene.searchable} onClick={()=>comb(scene)}>{scene.searchable?'搜证':'已无线索'}</Button>
      return <ListItem wrap key={scene._id} extra={searchBtn}>
        {scene.name}
      </ListItem>
    });
  }

  return (<div className={classnames(['container flex-column-container'])}>
    <ScrollableList>
      <SearchOverView defaultExpand/>
      {renderScenes()}
    </ScrollableList>
  </div>)
}
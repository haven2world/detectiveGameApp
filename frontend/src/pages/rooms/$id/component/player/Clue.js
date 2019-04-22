import React,{useEffect, useState, useContext, useRef} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, Badge, Tag } from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import playerActions from '@/constant/playerActions';
import gameStatus from '@/constant/gameStatus';
import styles from './player.css';
import SearchOverView from '@/pages/rooms/$id/component/player/SearchOverView';
const ListItem = List.Item;

/**
 * 线索显示
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, currentStage} = ctx.store;

  const [list, setList] = useState({self:[],shared:[]});
  const [filterScene, setFilterScene] = useState('all');
  const [filters, setFilters] = useState([{key:'all',name:'全部'}]);
  const roleMap = useRef({});

  //当game发生变动时重新计算标签
  useEffect(()=>{
    game.roles.forEach(role=>roleMap.current[role._id]=role);
    generateSceneFilter(game);
    calcList(game, filterScene);
  },[game]);

  //生成所有标签
  function generateSceneFilter(game){
    let result = [{key:'all',name:'全部'}];
    //将所有场景加到筛选标签中
    game.document.scenes.forEach(scene=>{
      result.push({key:scene._id, name:scene.name});
    });
    setFilters(result);
  }

  //切换筛选场景
  function onChangeFilter(key, selected) {
    setFilterScene(key);
    calcList(game, key);
  }

  //计算筛选后的列表
  function calcList(game, filterKey) {
    let self = game.currentRole.clues.filter(clue=>filterKey==='all'||filterKey===clue.sceneId);
    let shared = game.currentRole.sharedClues.filter(clue=>filterKey==='all'||filterKey===clue.sceneId);
    setList({self, shared});
  }

  //公开线索
  function shareClue(clue) {
    ctx.actions(playerActions.SHARE_CLUE,{gameClueId:clue._id});
  }

  //渲染标签
  function renderFilter() {
    return filters.map((filter, index)=>
      //用disable模拟选中，这样被选中的无法取消
      <Tag key={index}
           disabled={filter.key===filterScene}
           selected={filter.key===filterScene}
           onChange={(selected)=>onChangeFilter(filter.key, selected)}
           className={classnames([styles.clueFilterTag,filter.key===filterScene?styles.clueFilterTagActive:''])}
      >{filter.name}</Tag>)
  }
  //渲染线索
  function renderClues() {
    let views = [];
    list.self.forEach((clue, index)=>{
      views.push( <ListItem wrap key={'self_'+index}
        extra={!clue.shared?(<Button size='small' onClick={()=>shareClue(clue)} inline>公开</Button>):
          <span className='warning-text'>已公开</span>}
      >
        {clue.document.name}
        <ListItem.Brief>
          <div>发现人：你自己</div>
          <div>{clue.document.content}</div>
        </ListItem.Brief>
      </ListItem>);
    });
    list.shared.forEach((clue, index)=>{
      views.push( <Badge corner text='已分享'>
        <ListItem wrap key={'shared_'+index}>
          {clue.document.name}
          <ListItem.Brief>
            <div>发现人：{roleMap.current[clue.founder].document.name}</div>
            <div>{clue.document.content}</div>
          </ListItem.Brief>
        </ListItem>
      </Badge>);
    });
    return views
  }

  return (<div className={classnames(['container flex-column-container'])}>
    <ScrollableList>
      <SearchOverView />
      <div className={styles.clueFilterWrapper}>{renderFilter()}</div>
      {renderClues()}
    </ScrollableList>
  </div>)
}
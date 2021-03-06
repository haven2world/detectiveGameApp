import React,{useEffect, useState, useContext, createElement} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, Drawer} from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import AvatarCard from '@/component/AvatarCard';
import Player from '../../player';
import playerActions from '@/constant/playerActions';
import gameStatus from '@/constant/gameStatus';
import RoleListHorizontal from './RoleListHorizontal';
import Story from './Story';
import BottomBar from './BottomBar';
import Clue from './Clue';
import Scene from './Scene';
import Task from './Task';
import Role from './Role';
import StageDrawer from './StageDrawer';
import styles from './player.css';
import gameViewActions from '@/constant/gameViewActions';

const ListItem = List.Item;

/**
 * 游戏主界面
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game, showStage, shownRowDetail, leaveFlag, stopFlag, sentEndingFlag} = ctx.store;

  const [contentView, setContentView] = useState('story');

  //初始化数据
  useEffect(()=>{
    ctx.actions(playerActions.INIT_GAME, {gameId: sessionStorage.getItem('playerGameId')});
  },[]);
  //检测被请离
  if(leaveFlag){
    Modal.alert('提示','您已被房主请离房间',[
      {text:'离开', onPress:router.goBack},
    ]);
  }
  //检测游戏中止
  if(stopFlag){
    Modal.alert('提示','游戏已经被房主中止',[
      {text:'离开', onPress:router.goBack},
    ]);
  }
  //检测游戏结束
  if (sentEndingFlag) {
    Modal.alert('提示', '游戏已结束，请查看结局', [
      {
        text: '查看结局', onPress: () => {
          setContentView('story');
          ctx.dispatch({ type: gameViewActions.SET_STAGE, data: { stage: 'ending' } });
          ctx.dispatch({ type: gameViewActions.SET_NEW_FLAG, data: { sentEndingFlag: false } });
        },
      },
    ]);
  }

  //渲染主体部分
  function renderContentView() {
    const viewMap = {
      story:Story,
      clue:Clue,
      scene:Scene,
      task:Task,
      role:Role
    };
    if(contentView === 'role'){
      let props = {
        editable:false,
        url:shownRowDetail.document.photo,
        name:shownRowDetail.document.name,
        description:shownRowDetail.document.description
      };
      return <Role avatorProps={props} />;
    }else{
      return createElement(viewMap[contentView]);
    }
  }

  const titleMap = {
    story:'剧情',
    clue:'线索',
    scene:'搜证',
    role:'个人汇总'
  };

  //渲染标题
  function renderTitle() {
    let title = titleMap[contentView];
    let isPause = game.status === gameStatus.pause;
    if(isPause){
      title = '暂停中';
    }

    return <span className={isPause?'warning-text':''}>{title}</span>
  }

  if(!game){
    return (
      <div className='container'>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >加载中...</NavBar>
        <LoadingPage/>
      </div>);
  }else{
    return (
      <div className='container flex-column-container'>
        <NavBar
          mode={'light'}
          icon={<Icon type={'left'}/>}
          onLeftClick={router.goBack}
        >{renderTitle()}</NavBar>
        {RenderIf(game.status===gameStatus.over)(
          <NoticeBar >游戏已经结束</NoticeBar>
        )}
        <Drawer
          className={styles.drawer}
          sidebar={<StageDrawer setContentView={setContentView}/>}
          onOpenChange={()=> ctx.dispatch({type:gameViewActions.TOGGLE_STAGE})}
          contentStyle={{display:'flex', flexDirection:'column',height:'100%',position:'relative' }}
          sidebarStyle={{background:'#fff',height:'100%'}}
          open={showStage}
        >
          <RoleListHorizontal contentView={contentView} setContentView={setContentView}/>
          <div style={{flex:1}} className={classnames([styles.contentView])}>
            {/*重置页面为story*/}
            {RenderIf(contentView!=='story')(
              <div className={classnames([styles.resetButton, 'clickable'])} onClick={()=>{setContentView('story')}}>
                <div className={styles.resetButtonBackground} >
                  <Icon type='cross' style={{color:'#fff'}} className={styles.resetButtonX}/></div>
              </div>
            )}
            {renderContentView()}
          </div>
        </Drawer>
        <BottomBar setContentView={setContentView} currentContentView={contentView}/>
      </div>);
  }
}
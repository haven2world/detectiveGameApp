import React,{useEffect, useState, useContext, createElement} from 'react';
import router from 'umi/router';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, TextareaItem, NoticeBar, } from 'antd-mobile';
import { formatTime, RenderIf } from '@/utils/commonUtils';
import { toast } from '@/utils/toastUtils';
import LoadingPage from '@/component/LoadingPage';
import ScrollableList from '@/component/ScrollableList';
import Player from '../../player';
import playerActions from '@/constant/playerActions';
import gameStatus from '@/constant/gameStatus';
import RoleListHorizontal from './RoleListHorizontal';
import Story from './Story';
import BottomBar from './BottomBar';
import Clue from './Clue';
import Scene from './Scene';
import styles from './player.css';

const ListItem = List.Item;

/**
 * 游戏主界面
 */

export default function(props) {
  const ctx = useContext(Player.Context);
  const {game} = ctx.store;

  const [contentView, setContentView] = useState('story');

  //初始化数据
  useEffect(()=>{
    ctx.actions(playerActions.INIT_GAME)
  },[]);

  //渲染主体部分
  function renderContentView() {
    const viewMap = {
      story:Story,
      clue:Clue,
      scene:Scene,
    };
    return createElement(viewMap[contentView])
  }

  //渲染标题
  function renderTitle() {
    let title = game.document.name;
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
        <RoleListHorizontal/>
        <div style={{flex:1}} className={styles.contentView}>
          {/*重置页面为story*/}
          {RenderIf(contentView!=='story')(
            <div className={classnames([styles.resetButton, 'clickable'])} onClick={()=>{setContentView('story')}}>
              <div className={styles.resetButtonBackground} >
                <Icon type='cross' style={{color:'#fff'}} className={styles.resetButtonX}/></div>
            </div>
          )}
          {renderContentView()}
        </div>
        <BottomBar setContentView={setContentView}/>
      </div>);
  }
}
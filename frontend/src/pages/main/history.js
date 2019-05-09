import React, { useState, useEffect } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Result } from 'antd-mobile';
import styles from './history.css';
import * as services from '@/utils/services';
import router from 'umi/router';
import { formatDate, formatTime, RenderIf } from '@/utils/commonUtils';
import ScrollableList from '@/component/ScrollableList'

const ListItem = List.Item;

export default function(){

  const [history, setHistory] = useState([]);

  useEffect(()=>{
    setTimeout(update);
  },[]);
  function update() {
    services.fetchHistoryGames().then(result=>{
      if(result && result.code === 0){
        let manage = result.data.games.manage;
        manage.forEach(item=>item.manageFlag=true);
        let history = manage.concat(result.data.games.play);
        setHistory(history);
      }
    });
  }

  function renderContent() {
    if(history.length){
      return <ScrollableList>
        {history.map((game=>{
          if(game.manageFlag){
            return <ListItem
              key={'manage_'+ game._id}
              onClick={()=>router.push('/rooms/' + game._id + '/management')}
              arrow={'horizontal'}
              wrap
            >
              【房主】{game.document.name}
              <ListItem.Brief>
                {formatTime(game.updateTime, true)}</ListItem.Brief>
            </ListItem>
          }else{
            return <ListItem
              key={'play_'+ game._id}
              onClick={()=>{
                sessionStorage.setItem('playerGameId', game._id);
                router.push('/rooms/' + game._id + '/player')
              }}
              arrow={'horizontal'}
              wrap
            >
              {game.document.name}
              <ListItem.Brief>
                {formatTime(game.updateTime, true)}</ListItem.Brief>
            </ListItem>
          }
        }

          ))}
      </ScrollableList>
    }else{
      return <Result
        img={<i className="fas fa-glass-martini-alt fa-3x" style={{color:'#D0104C'}}/>}
        title={'暂无记录'}
        message={'赶快开始一场游戏吧, cheers~'}
      />
    }
  }

  return (
    <div className={'container flex-column-container'}>
      <NavBar
        mode={'light'}
        rightContent={<span><i className="fa fa-refresh clickable" style={{fontSize:16 }} onClick={update}/></span>}
      >游戏历史</NavBar>
      {renderContent()}
    </div>
  )

}



'use strict';
import React,{useReducer,  useState, useEffect } from 'react';
import Main from './component/player/Main';
import {playerReducer, initState} from './component/player/playerReducer';
import * as services from '@/utils/services';
/**
 * 游戏根页面
 */

const PlayerContext = React.createContext(null);

export default function Player(props) {
  const {computedMatch} = props;
  const {id:gameId} = computedMatch.params;
  const [ws, setWS] = useState(null);

  //建立ws
  useEffect(()=>{
    let wsInstance = services.establishWSForGamer();
    setWS(wsInstance);
    return ()=>{
      wsInstance.close();
    }
  },[]);

  if(ws){
    const [store, dispatch] = useReducer(playerReducer(ws), initState);
    const actions = (type)=>{
      dispatch(()=>({type}));
    };

    useEffect(()=>{
      //监听ws
      ws.addListener((data)=>{
        dispatch(()=>data);
      });
    },[]);

    return (
      <PlayerContext.Provider value={{store, actions, gameId}}>
        <Main/>
      </PlayerContext.Provider>
    );
  }else{
    return <div/>;
  }
}

Player.Context = PlayerContext;
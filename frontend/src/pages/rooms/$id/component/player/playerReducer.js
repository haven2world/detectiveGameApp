import React,{useReducer} from 'react';
import playerActions from '@/constant/playerActions';
import gameViewActions from '@/constant/gameViewActions';
import managerActions from '@/constant/managerActions';

/**
 *  玩家数据reducer
 */


export const initState = {
  game:null,
  currentStage:1,
  showStage:false,
  shownRowDetail:null,
};

export const playerReducer = (ws)=>(state, action)=>{
  const {data} = action;
  console.log(action)
  switch (action.type){
    case playerActions.INIT_GAME:
      return {...state, game: data.game};

    case gameViewActions.SET_STAGE:
      return {...state, currentStage:data.stage};
    case gameViewActions.TOGGLE_STAGE:
      return {...state, showStage:!state.showStage};
    case gameViewActions.SET_ROLE_SHOWN:
      return {...state, shownRowDetail:data.role};

  }
  return initState;
};
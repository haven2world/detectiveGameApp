import React,{useReducer} from 'react';
import playerActions from '@/constant/playerActions';
import managerActions from '@/constant/managerActions';

/**
 *  玩家数据reducer
 */


export const initState = {
  game:null,
};

export const playerReducer = (ws)=>(state, action)=>{
  const {data} = action;
  console.log(action)
  switch (action.type){
    case playerActions.INIT_GAME:
      return {...state, game: data.game};
  }
  return initState;
};
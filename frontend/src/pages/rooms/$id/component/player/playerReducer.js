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
  leaveFlag:false,
  clueNewFlag:false,
  taskNewFlag:true,
};

export const playerReducer = (ws)=>(state, action)=>{
  const {data} = action;
  console.log(action)
  switch (action.type){
    case playerActions.INIT_GAME:
      //增加当前角色引用
      data.game.currentRole = data.game.roles.find(role=>!!role.sharedClues);
      return {...state, game: data.game};
    case playerActions.COMB_SCENE:{
      const {skillUse, clueInstance} = data;
      let newGame = {...state.game};
      newGame.currentRole.skillUse = skillUse;
      newGame.currentRole.clues.unshift(clueInstance);
      return {...state, game:newGame};
    }
    case playerActions.COMB_EFFECT:{
      const {scenes} = data;
      let newGame = {...state.game};
      newGame.document.scenes = scenes;
      return {...state, game:newGame};
    }
    case playerActions.SHARE_CLUE:{
      const {gameClueId} = data;
      let newGame = {...state.game};
      newGame.currentRole.clues.find(clue=>clue._id===gameClueId).shared = true;
      return {...state, game:newGame, clueNewFlag:true};
    }
    case playerActions.SHARE_EFFECT:{
      const {scenes, sharedClues} = data;
      let newGame = {...state.game};
      newGame.document.scenes = scenes;
      newGame.currentRole.sharedClues = sharedClues;
      return {...state, game:newGame};
    }



    case gameViewActions.SET_STAGE:
      return {...state, currentStage:data.stage};
    case gameViewActions.TOGGLE_STAGE:
      return {...state, showStage:!state.showStage};
    case gameViewActions.SET_ROLE_SHOWN:
      return {...state, shownRowDetail:data.role};
    case gameViewActions.SET_NEW_FLAG:
      return {...state, ...data};



    case managerActions.REMOVE_PLAYER:{
      const {gameId, roleId} = data;
      if(!state.game || (gameId === state.game._id && roleId === state.game.currentRole._id)){
        return {...state, leaveFlag:true};
      }else{
        return state;
      }
    }
    case managerActions.CANCEL_TASK:
    case managerActions.ENSURE_TASK:{
      const {gameId, roleId, taskId} = data;
      if(state.game && gameId === state.game._id && roleId === state.game.currentRole._id){
        let newGame = {...state.game};
        if(!newGame.currentRole.finishedTask){
          newGame.currentRole.finishedTask = {};
        }
        newGame.currentRole.finishedTask[taskId] = {[managerActions.ENSURE_TASK]:true,[managerActions.CANCEL_TASK]:false}[action.type];
        return {...state, game: newGame, taskNewFlag:true};
      }else{
        return state;
      }
    }
    case managerActions.ADJUST_DIFFICULTY:{
      const {gameId, difficultyLevel} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game, difficultyLevel};
        return {...state, game: newGame};
      }else{
        return state;
      }
    }
  }
  return initState;
};
import React,{useReducer} from 'react';
import playerActions from '@/constant/playerActions';
import gameViewActions from '@/constant/gameViewActions';
import managerActions from '@/constant/managerActions';
import gameStatus from '@/constant/gameStatus';
import { toast } from '@/utils/toastUtils';

/**
 *  玩家数据reducer
 */


export const initState = {
  game:null,
  currentStage:1,
  showStage:false,
  shownRowDetail:null,
  leaveFlag:false,
  stopFlag:false,
  clueNewFlag:false,
  taskNewFlag:true,
  newSceneFlag:false,
  sentEndingFlag: false,
};

export const playerReducer = (ws)=>(state, action)=>{
  const {data} = action;
  console.log(action)
  switch (action.type){
    case playerActions.INIT_GAME:
      let currentStage = state.currentStage;
      //增加当前角色引用
      data.game.currentRole = data.game.roles.find(role=>!!role.sharedClues);
      if(data.game.sentEnding){
        currentStage = 'ending';
      }
      return {...state, game: data.game, currentStage};
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
    case managerActions.PUSH_STAGE:{
      const {gameId, scenes, stories, newSceneFlag, stage} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game};
        newGame.document.scenes = scenes;
        newGame.document.stories = newGame.document.stories.concat(stories);
        newGame.stage = stage;
        toast.info('游戏进入下一阶段！');
        return {...state, game: newGame, newSceneFlag};
      }else{
        return state;
      }
    }
    case managerActions.START_GAME:{
      const {gameId, scenes, stories, newSceneFlag, stage} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game, status:gameStatus.playing};
        newGame.document.scenes = scenes;
        newGame.document.stories = newGame.document.stories.concat(stories);
        newGame.stage = stage;
        toast.info('游戏开始啦！');
        return {...state, game: newGame, newSceneFlag};
      }else{
        return state;
      }
    }
    case managerActions.PAUSE_GAME:{
      const {gameId} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game, status:gameStatus.pause};
        toast.info('游戏已暂停');
        return {...state, game: newGame};
      }else{
        return state;
      }
    }
    case managerActions.RESUME_GAME:{
      const {gameId} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game, status:gameStatus.playing};
        toast.info('游戏已继续');
        return {...state, game: newGame};
      }else{
        return state;
      }
    }
    case managerActions.SEND_ENDING:{
      const {gameId, endings} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game, sentEnding:true};
        newGame.document.endings = endings;
        return {...state, game: newGame, sentEndingFlag:true};
      }else{
        return state;
      }
    }
    case managerActions.OVER_GAME:{
      const {gameId} = data;
      if(state.game && gameId === state.game._id){
        let newGame = {...state.game, status:gameStatus.over};
        return {...state, game: newGame, stopFlag:true};
      }else{
        return state;
      }
    }
  }
  return initState;
};
import { useState, useRef, useEffect } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Button} from 'antd-mobile';
import styles from './start.css';
import * as services from '@/utils/services';
import router from 'umi/router';
import PickerCaller from '@/component/PickerCaller';
import { toast } from '@/utils/toastUtils';


export default function(){

  //已发布的个人剧本
  const [pickerConfig, setPickerConfig] = useState({});
  const [docs, setDocs] = useState([]);
  const [chosenDocId, setDocId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const picker = useRef(null);

  //初始化
  useEffect(()=>{
    services.fetchGameDocuments().then(result=>{
      if(result && result.code === 0){
        let docsTemp = result.data.documents.filter(doc=>doc.publishFlag);
        let data = docsTemp.map(doc=>({label:doc.name,value:doc._id}));
        setDocs(data);
      }
    });
    checkPlayingGame();
  },[]);

  //检查是否有进行中的游戏
  function checkPlayingGame() {
    services.fetchPlayingGame().then(result=>{
      if(result && result.code === 0 && result.data.gameId){
        setGameData(result.data);
      }
    });
  }

  //加入游戏
  function toJoinGame() {
    if(gameData && gameData.gameId){
      if(gameData.managerFlag){
      //  进入游戏管理页面
        router.push('/rooms/' + gameData.gameId + '/management');
      }else{
      //  以普通玩家加入游戏
        router.push('/rooms/' + gameData.gameId + '/player');
      }
    }else{
      router.push('/rooms');
    }
  }

  //创建房间
  function toCreateGame() {
    if(docs.length===0){
      toast.fail('请先创建并发布剧本');
      return;
    }
    let config = {data:docs, title:'请选择一个剧本'};
    setPickerConfig(config);
    setDocId(null);
    picker.current.showPicker();
  }

  //选择难度
  function toChooseLevel() {
    let config = {
      data: [
        { label: '简单难度', value: 'easy' },
        { label: '普通难度', value: 'normal' },
        { label: '困难难度', value: 'hard' },
      ],
      title: '请选择一个难度',
    };
    setPickerConfig(config);
    picker.current.showPicker();
  }

  function onPickerChosen(data) {
    if(chosenDocId){
      createGame(data, chosenDocId);
    }else{
      setDocId(data);
      setTimeout(toChooseLevel);
    }
  }

  function createGame(level, docId) {
    services.createGameInstance({level, docId}).then(result=>{
      if(result && result.code === 0){
        router.push('/rooms/' + result.data.gameId + '/management');
      }
    })
  }

  return (
    <div className={'container'}>
      <Flex direction={'column'} className={'container'}>
        <div className={styles.titleWrapper}>
          <div className={styles.gameTitle}>侦探游戏</div>
        </div>
        <div style={{width:'100%'}}>
          <WhiteSpace size={'lg'}/>
          <Button type={'primary'} onClick={toJoinGame}>{gameData?'回到游戏':'加入游戏'}</Button>
          <WhiteSpace size={'lg'}/>
          <Button onClick={toCreateGame}>创建房间</Button>
          <WhiteSpace size={'lg'}/>
          <Button onClick={()=>router.push('/documents')}>管理剧本</Button>
          <WhiteSpace size={'lg'}/>
        </div>
      </Flex>
      <PickerCaller
        ref={picker}
        onOk={([data])=>{onPickerChosen(data)}}
        cols={1}
        {...pickerConfig}
      />
    </div>
  )

}



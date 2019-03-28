import { useState, useRef, useEffect } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Button} from 'antd-mobile';
import styles from './start.css';
import * as services from '@/utils/services';
import router from 'umi/router';
import PickerCaller from '@/component/PickerCaller';
import { toast } from '@/utils/toastUtils';


export default function(){

  //已发布的个人剧本
  const [docsConfig, setDocsConfig] = useState([]);
  const picker = useRef(null);

  //初始化
  useEffect(()=>{
    services.fetchGameDocuments().then(result=>{
      if(result && result.code === 0){
        let docsTemp = result.data.documents.filter(doc=>doc.publishFlag);
        let config = docsTemp.map(doc=>({label:doc.name,value:doc._id}));
        setDocsConfig(config);
      }
    });
  },[]);

  //创建房间
  function toCreateGame() {
    if(docsConfig.length===0){
      toast.fail('请先创建并发布剧本');
      return;
    }
    picker.current.showPicker();
  }

  function createGame(docId) {

  }

  return (
    <div className={'container'}>
      <Flex direction={'column'} className={'container'}>
        <div className={styles.titleWrapper}>
          <div className={styles.gameTitle}>侦探游戏</div>
        </div>
        <div style={{width:'100%'}}>
          <WhiteSpace size={'lg'}/>
          <Button type={'primary'}>加入游戏</Button>
          <WhiteSpace size={'lg'}/>
          <Button onClick={toCreateGame}>创建房间</Button>
          <WhiteSpace size={'lg'}/>
          <Button onClick={()=>router.push('/documents')}>管理剧本</Button>
          <WhiteSpace size={'lg'}/>
        </div>
      </Flex>
      <PickerCaller
        ref={picker}
        onOk={([docId])=>{createGame(docId)}}
        data={docsConfig}
        cols={1}
        title={'请选择一个剧本'}
      />
    </div>
  )

}



import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Button} from 'antd-mobile';
import styles from './start.css';
import * as services from '@/utils/services';
import router from 'umi/router';


export default function(){



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
          <Button>创建房间</Button>
          <WhiteSpace size={'lg'}/>
          <Button onClick={()=>router.push('/documents')}>管理剧本</Button>
          <WhiteSpace size={'lg'}/>
        </div>
      </Flex>
    </div>
  )

}



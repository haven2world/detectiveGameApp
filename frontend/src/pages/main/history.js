import { useState } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Result } from 'antd-mobile';
import styles from './history.css';
import * as services from '../../utils/services';
import router from 'umi/router';


export default function(){



  return (
    <div className={'container'}>
      <NavBar
        mode={'light'}
      >游戏历史</NavBar>
      <Result
        img={<i className="fas fa-glass-martini-alt fa-3x" style={{color:'#D0104C'}}/>}
        title={'更多精彩'}
        message={'还没开始码代码, cheers~'}
      />

    </div>
  )

}



import { useState } from 'react';
import { Card, Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Button } from 'antd-mobile';
import styles from './user.css';
import * as services from '../../utils/services';
import router from 'umi/router';


export default function(){

  //登出
  function signOut() {
    localStorage.removeItem('loginId');
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className={'container'}>
      <WingBlank>
        <WhiteSpace/>
        <Card>
          <Card.Header
            title={localStorage.loginId}
            thumb={<i className="fas fa-wheelchair"/>}
          />
        </Card>
        <WhiteSpace size={'lg'}/>
        <Button onClick={signOut}>退出登录</Button>
      </WingBlank>


    </div>
  )

}



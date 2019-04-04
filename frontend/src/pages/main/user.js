import { useState, useEffect } from 'react';
import { Card, Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, Button } from 'antd-mobile';
import styles from './user.css';
import * as services from '@/utils/services';
import router from 'umi/router';


export default function(){
  const [historyCount, setCount] = useState(0);

  useEffect(()=>{
    services.fetchHistoryGames().then(result=>{
      if(result && result.code === 0){
        let count = result.data.games.manage.length + result.data.games.play.length;
        setCount(count);
      }
    });
  },[]);

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
            title={<div className={styles.name}>{localStorage.loginId}</div>}
            thumb={<img src={'/detective/assets/img/yanzu.jpg'} style={{height:60}}/>}
          />
          <Card.Body>
            {/*<p>共参与&nbsp;{historyCount}&nbsp;次游戏</p>*/}
            <p>我也不知道要写什么</p>
          </Card.Body>
        </Card>
        <WhiteSpace size={'lg'}/>
        <Button onClick={signOut}>退出登录</Button>
      </WingBlank>


    </div>
  )

}



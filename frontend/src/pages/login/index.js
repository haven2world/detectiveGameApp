import { useState } from 'react';
import Link from 'umi/link';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button} from 'antd-mobile';
import styles from './index.css';
import { Toast } from 'antd-mobile/lib/index';
import * as services from '../../utils/services';
import { getPasswordHash } from '../../utils/commonUtils';
import router from 'umi/router';


export default function(){
  let initialName = localStorage.loginId||'';

  //状态
  const [name, setName] = useState(initialName);
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  //登录
  function signIn() {
    //校验
    if(!name){
      Toast.info('请输入账号');
      return;
    }
    if(!pwd){
      Toast.info('请输入密码');
      return;
    }
    let param = {
      loginId:name,
      password:getPasswordHash(pwd, name)
    }
    setLoading(true);
    services.signIn(param).then(result=>{
      setLoading(false);
      if( result && result.code === 0){
        localStorage.loginId = name;
        localStorage.token = result.data.token;
        router.push('/main');
      }
    })
  }

  return(
    <div className={styles.container}>
      <Flex direction={'column'} className={styles.container}>
        <div className={styles.titleWrapper}>
          <div className={styles.gameTitle}>侦探游戏</div>
        </div>
        <WingBlank>
          <List className={styles.inputWrapper}>
            <WhiteSpace />
            <InputItem
              defaultValue={name}
              placeholder='请输入账号'
              clear
              onChange={(str)=>setName(str.trim())}
            >账号</InputItem>
            <WhiteSpace />
            <InputItem
              defaultValue={pwd}
              placeholder='请输入密码'
              type={'password'}
              clear
              onChange={(str)=>setPwd(str)}
            >密码</InputItem>
            <WhiteSpace size={'lg'}/>
          </List>
          <WhiteSpace size={'lg'}/>
          <Button type={'primary'} onClick={signIn} loading={loading} >登录</Button>
          <WhiteSpace size={'lg'}/>
          <Flex className={styles.linkRow}>
            <Flex.Item className={'text-center'}>
              <Link className={'primary-text'} to="/login/signUp">注册</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </Flex>
    </div>
  )
}



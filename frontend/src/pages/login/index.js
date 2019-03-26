import { useState } from 'react';
import Link from 'umi/link';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button} from 'antd-mobile';
import styles from './index.css';
import {toast} from '@/utils/toastUtils';
import * as services from '@/utils/services';
import { getPasswordHash } from '@/utils/commonUtils';
import router from 'umi/router';


export default function(){
  let initialName = localStorage.loginId||'';

  //状态
  const [name, setName] = useState(initialName);
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  //登录
  function signIn(_name, _pwd) {
    if(!_name || !_pwd){
      //校验
      if(!name){
        toast.info('请输入账号');
        return;
      }
      if(!pwd){
        toast.info('请输入密码');
        return;
      }
      _name = name;
      _pwd = pwd;
    }

    let param = {
      loginId:_name,
      password:getPasswordHash(_pwd, _name)
    };
    setLoading(true);
    services.signIn(param).then(result=>{
      setLoading(false);
      if( result && result.code === 0){
        localStorage.loginId = _name;
        localStorage.token = result.data.token;
        router.push('/main');
      }
    })
  }
  
  //匿名登录
  function anonymousSignIn() {
    toast.info('请注意，匿名登录只在当前设备当前浏览器有效');
    let account;
    if(localStorage.anonymousAccount){
      account = localStorage.anonymousAccount;
      signIn(account, 'password');
    }else{
      setLoading(true);
      services.anonymousSignUp().then(result=>{
        setLoading(false);
        if( result && result.code === 0){
          localStorage.loginId = result.data.anonymousLoginId;
          localStorage.anonymousAccount = result.data.anonymousLoginId;
          localStorage.token = result.data.token;
          router.push('/main');
        }
      })
    }
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
          <Button type={'default'} onClick={anonymousSignIn} loading={loading} style={{marginTop:5}}>匿名登录</Button>
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



import styles from './signUp.css';
import {NavBar, Toast, Icon, Flex, WhiteSpace, WingBlank, InputItem, List, NoticeBar, Button} from 'antd-mobile';
import router from 'umi/router';
import { useState } from 'react';
import * as services from '../../utils/services';
import {getPasswordHash} from '../../utils/commonUtils';

export default function() {

  //状态
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [rePwd, setRePwd] = useState('');
  const [loading, setLoading] = useState(false);

  //注册
  let handleSignUp = ()=>{
    //校验
    if(!name){
      Toast.info('请输入账号');
      return;
    }
    if(!pwd){
      Toast.info('请输入密码');
      return;
    }
    if(!rePwd){
      Toast.info('请重复输入密码');
      return;
    }
    if(pwd!==rePwd){
      Toast.info('两次输入密码不一致');
      return;
    }

    let param = {
      loginId:name,
      password:getPasswordHash(pwd, name)
    }
    setLoading(true);
    services.signUp(param).then(result=>{
      setLoading(false);
      if( result && result.code === 0){
        Toast.success('注册成功');
        localStorage.loginId = name;
        localStorage.token = result.data.token;
        router.replace('/');
      }
    })
  };

  return (
    <div className={styles.container}>
      <NavBar
        mode={'light'}
        icon={<Icon type={'left'}/>}
        onLeftClick={router.goBack}
      >注册</NavBar>
      <NoticeBar>暂时无法找回密码，请保存好密码</NoticeBar>
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
          <InputItem
            defaultValue={rePwd}
            placeholder='请重复输入密码'
            type={'password'}
            clear
            onChange={(str)=>setRePwd(str)}
          >&nbsp;&nbsp;</InputItem>
          <WhiteSpace />
        </List>
        <Button loading={loading} type={'primary'} onClick={handleSignUp}>注册</Button>
      </WingBlank>

    </div>
  );
}

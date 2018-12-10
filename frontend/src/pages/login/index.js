import { useState } from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { Flex, WhiteSpace, WingBlank, InputItem, List} from 'antd-mobile';
import styles from './index.css';


export default function(){
  let initialName = localStorage.loginId||'';

  const [name, setName] = useState(initialName);
  const [pwd, setPwd] = useState('');

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
              onChange={(str)=>setName(str)}
            >账号</InputItem>
            <WhiteSpace />
            <InputItem
              defaultValue={pwd}
              placeholder='请输入密码'
              type={'password'}
              clear
              onChange={(str)=>setPwd(str)}
            >密码</InputItem>
            <WhiteSpace />
          </List>
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



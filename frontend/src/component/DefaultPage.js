'use strict';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, ActivityIndicator} from 'antd-mobile';
/**
 * 默认页面
 */

export default function ({content}){
  return (<div className={'flex-center'} style={{flex:1,paddingTop:100}}>
    <div>
      <img src={require('@/assets/img/empty.png')} style={{ width: 300, height:200}}/>
      <div className={'text-center gray-text'} style={{fontSize:20, opacity:0.5}}>{content}</div>
    </div>
  </div>)
}
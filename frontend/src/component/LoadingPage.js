'use strict';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, ActivityIndicator} from 'antd-mobile';
/**
 * 加载页面
 */

export default function (){
  return (<div className={'flex-center'} style={{flex:1,paddingTop:100}}>
    <div>
      <div className={'flex-center'}>
        <i className={'fas fa-spinner fa-w-16 fa-spin fa-2x'} style={{color:'#108ee9'}} />
      </div>
      <p className={'flex-center gray-text'} >正在加载中</p>
    </div>
  </div>)
}
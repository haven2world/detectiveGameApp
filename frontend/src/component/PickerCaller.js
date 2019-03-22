'use strict';
import {Component} from 'react';
import { useState, useEffect, useRef } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper, Picker} from 'antd-mobile';

/**
 * picker封装
 */

export default class PickerCaller extends Component{
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  showPicker(){
    let target = this._ref.childNodes[0].childNodes[0]
    target.click();
  }

  render(){
    let {data, value, col, title, onOk, onDismiss, okText, dismissText, cascade, disabled} = this.props;
    return(
      <div
        ref={ref=>this._ref = ref}
        style={{display:'none'}}
      >
        <Picker
          {...this.props}
        >
          <List.Item>&nbsp;</List.Item>
        </Picker>
      </div>
    )
  }
}

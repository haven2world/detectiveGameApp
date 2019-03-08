'use strict';


import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';

/**
 * 可滚动List 外层需要是flex布局
 */

export default function ScrollableList(props) {
  return(
      <div style={{ flex: 1, position: 'relative' }}>
        <List
          className={'container'}
          style={{ position: 'absolute', overflow: 'scroll' }}
          {...props}
        >
        </List>
      </div>
    );
}
'use strict';


/**
 * 主页的嵌套布局
 */
import { Flex, WhiteSpace, WingBlank, InputItem, List, NavBar, Icon, TabBar } from 'antd-mobile';
import { useState } from 'react';
import router from 'umi/router';
import withRouter from 'umi/withRouter';

function Layout(props) {


  const tabs = [
    {title:'开始',key:'start',iconFa:'fas fa-user-secret',path:'/main/start'},
    {title:'历史',key:'history',iconFa:'fas fa-history',path:'/main/history'},
    {title:'我的',key:'user',iconFa:'fas fa-user-alt',path:'/main/user'},
  ];

  //计算当前tab
  function getCurrentTabFromUrl(){
    const {pathname} = props.location;
    return tabs.find((tab)=>{
      return pathname.indexOf(tab.path)>=0
    }).key
  }
  //计算tab是否被选中
  function tabIsSelected(tab) {
    return getCurrentTabFromUrl() === tab.key
  }
  //跳转路由
  function changeTab(tab) {
    router.replace(tab.path);
  }

  return(
    <div className={'container'}>
      <TabBar>
        {tabs.map(tab=>   <TabBar.Item
          icon={<i className={tab.iconFa + " fa-lg"}/>}
          selectedIcon={<i className={tab.iconFa + " fa-2x"}/>}
          onPress={()=>{changeTab(tab)}}
          selected={tabIsSelected(tab)}
          {...tab}
        >
          {props.children}
        </TabBar.Item>)}

      </TabBar>
    </div>
  )
}

export default withRouter(Layout);
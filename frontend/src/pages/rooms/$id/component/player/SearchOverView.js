import React, { useEffect, useState, useContext } from 'react';
import Player from '../../player';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, Tabs, Accordion, Card, } from 'antd-mobile';
import { RenderIf } from '@/utils/commonUtils';
import styles from './player.css';

/**
 * 调查信息总览
 */

export default function({ defaultExpand }) {
  const ctx = useContext(Player.Context);
  const { game, currentStage, game: { difficultyLevel } } = ctx.store;

  let clueCount = game.currentRole.clues.length;//发现线索数

  //渲染技能使用次数
  function renderSkillUse() {
    return game.currentRole.document.skills.map((skill, index)=>{
      let skillUse = game.currentRole.skillUse[index]||{count:0};
      let left = '无限';
      if(skill.maxCount){
        left = (skill.maxCount-skillUse.count)+ '/' + (skill.maxCount);
      }
      return <div key={index}>
        {skill.skillInfo.name}: {left}
      </div>
    });
  }

  return (<div>
    <Accordion defaultActiveKey={defaultExpand ? 'overview' : ''}>
      <Accordion.Panel header={'搜索信息总览'} key={'overview'}>
        <Card full>
          <Card.Body style={{ padding: '10px 20px'}}>
            <div  className={styles.searchOverviewBox}>
              {RenderIf(!difficultyLevel.keepClueSecret)(<div className='warning-text'>本局游戏所有线索自动共享</div>)}
              <div>此局剩余搜查次数：{(difficultyLevel.maxInquiryTimes - clueCount)}/{difficultyLevel.maxInquiryTimes}&nbsp;<span className='gray-text'>谨慎使用</span></div>
              {RenderIf(game.currentRole.document.skills.length>0)(<div>技能剩余使用次数:</div>)}
              {renderSkillUse()}
              <div>共发现线索: {clueCount}&nbsp;条</div>
            </div>
          </Card.Body>
        </Card>
      </Accordion.Panel>
    </Accordion>
  </div>);
}
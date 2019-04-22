'use strict';

import React,{ useState, useEffect, useRef ,Component} from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';
import styles from './editor.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { selectFile, validateFileByExtensionName } from '@/utils/commonUtils';
import mammoth from 'mammoth';

/**
 * 简化富文本
 */

export default class RichEditor extends Component{
// 构造
  constructor(props) {
    super(props);
    const {defaultValue, onSaveContent, onChange, onBlur} = props;
    // 初始状态
    this.state = {};
    this.editorRef = null;
    this.defaultData = defaultValue?defaultValue:'';
  }

  componentDidMount() {

  }
  shouldComponentUpdate(){
    return false;
  }

  //文字变化
   _onChange=(event, editor )=>{
    const data = editor.getData();
    this.onChange && this.onChange(data);
    console.log( { event, editor, data } );
  }

  //失去焦点
   _onBlur=(event, editor)=>{
    const data = editor.getData();
    this.props.onBlur && this.props.onBlur(data);
  }

  //解析word
   importWord=()=>{
    Modal.alert('警告','如果导入word文件将会覆盖已有内容，是否确认？',[
      {text:'取消'},
      {text:'确认', onPress:async()=>{
          let files = await selectFile(false, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          let file = files[0];
          if(validateFileByExtensionName(file,'docx')){
            let reader = new FileReader();

            reader.onload = (loadEvent)=>{
              let arrayBuffer = loadEvent.target.result;
              mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                .then(this.displayResult)
                .done();
            };

            reader.readAsArrayBuffer(file);
          }
        }},
    ]);
  }

  displayResult=(result)=>{
    this.editorRef.setData(result.value)
    console.log(result.message)
  }

  //保存内容
  onSave=()=>{
    let data = this.editorRef.getData();
    this.props.onSaveContent && this.props.onSaveContent(data);
  }

  render(){
    const config = {
      toolbar:['bold','undo'],
    };

    return(
      <WingBlank>
        <WhiteSpace/>
        <div className={styles.toolbar}>
          <Button type={'ghost'} size={'small'} inline onClick={this.importWord}>导入word</Button>
          <Button type={'primary'} size={'small'} inline onClick={this.onSave}>保存</Button>
        </div>
        <WhiteSpace/>
        <div className={styles.editorWrapper}>
          <CKEditor
            onInit={item=>this.editorRef=item}
            editor={ ClassicEditor }
            config={config}
            data={this.defaultData}
            onChange={this._onChange}
            onBlur={this._onBlur}
            placeholder={'开始编写该阶段的故事吧'}
          />
        </div>
      </WingBlank>
    )
  }
}

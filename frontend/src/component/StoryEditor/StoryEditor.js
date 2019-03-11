'use strict';

import { useState, useLayoutEffect, useRef } from 'react';
import { Flex, WhiteSpace, WingBlank, InputItem, List, Button, Icon, NavBar, Modal, TextareaItem, Stepper} from 'antd-mobile';
import styles from './story.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { selectFile, validateFileByExtensionName } from '@/utils/commonUtils';
import mammoth from 'mammoth';

/**
 * 简化富文本
 */

export default function({story}) {
  const editor = useRef(null);

  const config = {
    toolbar:['bold','undo'],
  };


  //文字变化
  function onChange(event, editor ) {
    const data = editor.getData();
    console.log( { event, editor, data } );
  }

  //解析word
  function importWord() {
    Modal.alert('警告','如果导入word文件将会覆盖已有内容，是否确认？',[
      {text:'确认', onPress:async()=>{
          let files = await selectFile(false, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          let file = files[0];
          if(validateFileByExtensionName(file,'docx')){
            let reader = new FileReader();

            reader.onload = function(loadEvent) {
              let arrayBuffer = loadEvent.target.result;
              mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                .then(displayResult)
                .done();
            };

            reader.readAsArrayBuffer(file);
          }
        }},
      {text:'取消'},
    ]);
  }

  function displayResult(result) {
    editor.current.setData(result.value)
    console.log(result.message)
  }


  return(
    <WingBlank>
      <WhiteSpace/>
      <div className={styles.toolbar}>
        <Button type={'ghost'} size={'small'} inline onClick={importWord}>导入word</Button>
        <Button type={'primary'} size={'small'} inline >保存</Button>
      </div>
      <WhiteSpace/>
      <div className={styles.editorWrapper}>
        <CKEditor
          onInit={item=>editor.current=item}
          editor={ ClassicEditor }
          config={config}
          data="<p>Hello from CKEditor 5!</p>"
          onChange={onChange}
          placeholder={'开始编写该阶段的故事吧'}
        />
      </div>
    </WingBlank>
  )
}

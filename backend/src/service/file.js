'use strict';


/**
 * 与文件相关的基础服务
 */
const fs = require('fs');
const path = require('path');

const service = {
  //保存上传的文件
  saveFile(url, file){
    let dirPath = path.dirname(url);
    if(!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath, {recursive :true});
    }

    return new Promise((resolve, reject)=>{
      fs.copyFile(file, url, fs.constants.COPYFILE_EXCL,(err)=>{
        if(err){
          reject(err);
        }
        //删除缓存
        fs.unlink(file, (err)=>{
          if(err){
            throw err
          }
        });
        resolve(true);
      })
    })
  },
};

module.exports = service;
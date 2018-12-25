'use strict';


/**
 * 与文件相关的基础服务
 */
const fs = require('fs');

const service = {
  saveFile(url, file, name){
    return new Promise((resolve, reject)=>{
      fs.copyFile(file, url, fs.constants.COPYFILE_EXCL,(err)=>{
        if(err){
          reject(err);
        }
        resolve(true);
      })
    })
  },
};

module.exports = service;
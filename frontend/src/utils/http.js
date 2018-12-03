'use strict';
import axios from 'axios'
import {goToLogin, isInArray} from "./commonUtils";

/**
 * 封装 axios
 */

let promiseArr = {};
let cancel;
const CancelToken = axios.CancelToken;
// 配置超时时间
axios.defaults.timeout = 100000;

// 标识这是一个 ajax 请求
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';



// 配置相应拦截

//请求拦截器
axios.interceptors.request.use(config => {
  //发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url] && promiseArr[config.url][config.method]) {
    promiseArr[config.url][config.method]('取消重复请求');
    promiseArr[config.url][config.method] = cancel
  } else {
    if(!promiseArr[config.url]){
      promiseArr[config.url] = {};
    }
    promiseArr[config.url][config.method] = cancel
  }
  // config.headers['Origin'] = window.location.origin;
  return config
}, error => {
  return Promise.reject(error)
})
const errorWhiteList = [
]
// 响应拦截器
axios.interceptors.response.use((response) => {
  let inWhiteList = isInArray(response.config.url, errorWhiteList, true);
  promiseArr[response.config.url][response.config.method] = null;
  // code处理
  switch (response.data.code){
    case 0:
      return response.data
    case 401:
      goToLogin();
      return response.data
    case 999:
      !inWhiteList&&toast.fail('服务器开小差了');
      return response.data
    default:
      !inWhiteList&&toast.fail(response.data.message);
      return response.data
  }
},
  err => {
    let inWhiteList = err.config&&isInArray(err.config.url, errorWhiteList, true);
    let cancelFlag = false;
    if (err && err.response) {
      promiseArr[err.config.url][err.config.method] = null;
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:
          goToLogin();
          err.message = '未授权，请重新登录'
          break;
        case 403:
          err.message = '拒绝访问'
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = '服务器开小差了'
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
    } else if(err.message === '取消重复请求') {
      cancelFlag = true;
    }else{
      err.message = "连接到服务器失败"
    }
    !inWhiteList && !cancelFlag && toast.fail(err.message);
    return Promise.resolve(err.response)
  }
)

export default {
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        headers:{'token':localStorage.ucToken},
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  post(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param,
        headers:{'token':localStorage.ucToken},
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //delete 请求
  delete(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        params: param,
        headers:{'token':localStorage.ucToken},
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //put 请求
  put(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url,
        data: param,
        headers:{'token':localStorage.ucToken},
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
//  上传文件
  upload(url, param){
    return new Promise((resolve, reject)=>{
      let formData = new FormData();
      for(let key in param){
        formData.append(key, param[key]);
      }

      axios({
        url,
        method:'post',
        data: formData,
        headers:{'Content-Type':"multipart/form-data", 'token':localStorage.ucToken},
        cancelToken: new CancelToken(c => {
          cancel = c
        }).then(res => {
          resolve(res)
        })
      })
    })
  },
//  下载文件
  download(url){
    return new Promise((resolve, reject)=>{
      axios({
        url,
        method:'get',
        responseType:'arraybuffer',
      }).then(res=>{
        let fileName = res.data// 文件地址
        let pathArr = url.split('/');
        let downName = pathArr[pathArr.length-1] // 文件下载名称
        const blob = new Blob([fileName])
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE10
          navigator.msSaveBlob(blob, downName)
        } else {
          //  chrome/firefox
          let aTag = document.createElement('a')
          aTag.download = downName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(aTag.href)
        }
      })
    })
  }
}

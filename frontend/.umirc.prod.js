var path = require('path');

// ref: https://umijs.org/config/
export default {
  base:'/detective',
  publicPath:'/detective/',
  outputPath:'./detective',
  define:{
    'process.env.NODE_ENV':'production'
  },
  hash:true,
}

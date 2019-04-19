var path = require('path');

// ref: https://umijs.org/config/
export default {
  base:'/detective',
  chainWebpack(config, {webpack}){
    // config.resolve.alias.set('#', path.resolve(__dirname,'src'))
  },
  define:{
    'process.env.NODE_ENV':'development'
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer:true
      },
      dynamicImport: false,
      title: 'Detective',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],
  extraPostCSSPlugins:[require('autoprefixer'),require('postcss-modules-values'),require('postcss-px-to-viewport')],
  proxy:{
    '/detective/apis':{
      target:'http://localhost:1019',
      changeOrigin:true,
      pathRewrite:{}
    },
    '/detective/assets':{
      target:'http://localhost:1019',
      changeOrigin:true,
      pathRewrite:{}
    }
  }
}

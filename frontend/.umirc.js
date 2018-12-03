var path = require('path');

// ref: https://umijs.org/config/
export default {
  chainWebpack(config, {webpack}){
    // config.resolve.alias.set('#', path.resolve(__dirname,'src'))

    // config.module.rule('css').test(/\.css$/).use('postcss-loader').loader('postcss-loader')
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer:true
      },
      dynamicImport: false,
      title: 'play',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],
}

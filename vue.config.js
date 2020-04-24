module.exports = {
  devServer: {
    open: true,
    port: 8848
  },
  publicPath: './', // 更改资源路径
  chainWebpack: config => {
    /**
     * 判断为生产模式时
     * 设定isProduce为true，使用cdn资源
     * 新建externals节点，定义不被打包的内容
     */
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('html').tap(args => {
        args[0].isProduce = true
        return args
      })
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts'
      })
    })
    /**
     * 判断为开发模式时
     * 设定isProduce为false，不使用cdn资源
     */
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args => {
        args[0].isProduce = false
        return args
      })
    })
    // 
  }
}

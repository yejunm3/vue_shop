// 判断是否是生产模式，配置节点
const is_remove = []
if (process.env.NODE_ENV === 'production') {
  is_remove.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [...is_remove]
}

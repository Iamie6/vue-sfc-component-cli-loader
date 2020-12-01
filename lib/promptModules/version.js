module.exports = (name, options) => {
  return {
    name: 'version',
    default: 'v0.0.1',
    type: 'input',
    message: `请填写组件 ${name} 的版本号:`,
    description: `有疑问请联系相关人`,
    validate: function (a, b) {
      if(/^v\d+\.\d+\.\d+$/.test(a)) {
        return true
      } else {
        console.log(' 的格式不正确,例: v1.2.3')
        return false
      }
    },
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
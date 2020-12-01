module.exports = (name, options) => {
  return {
    name: 'clientList',
    type: 'checkbox',
    default: options.CLIENT[0],
    message: `请选择组件适用的终端：`,
    description: `如果终端不够用， 请联系相关人`,
    choices: options.CLIENT,
    validate: function (a) {
      if (a.length) {
        return true
      } else {
        console.log('组件标签为必选项')
        return false
      }
    },
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
module.exports = (name, options) => {
  return {
    name: 'tagList',
    type: 'checkbox',
    default: options.TAG[0],
    message: `请选择组件标签：`,
    description: `如果标签不够用， 请联系相关人`,
    choices: options.TAG,
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
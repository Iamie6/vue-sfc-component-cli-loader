module.exports = (name, options) => {
  return {
    name: 'businessList',
    type: 'checkbox',
    default: options.BUSINESS[0],
    message: `请选择组件适用的业务线：`,
    description: `如果业务线不够用， 请联系相关人`,
    choices: options.BUSINESS,
    validate: function (a) {
      if (a.length) {
        return true
      } else {
        console.log('业务线为必选项')
        return false
      }
    },
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
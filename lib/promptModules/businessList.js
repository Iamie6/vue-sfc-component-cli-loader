const json5 = require('json5')

module.exports = (name, options) => {
  const BUSINESS = (json5.parse(options.BUSINESS_TAG) || []).map(item => {
    return item.business
  })
  return {
    name: 'businessList',
    type: 'list',
    default: BUSINESS[0],
    message: `请选择组件适用的业务线：`,
    description: `如果业务线不够用， 请联系相关人`,
    choices: BUSINESS,
    validate: function (a) {
      if (a.length) {
        return true
      } else {
        console.log('业务线为必选项')
        return false
      }
    },
    link: '/lc/npm/resource-platform/blob/master/README.md'
  }
}
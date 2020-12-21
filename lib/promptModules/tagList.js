const json5 = require('json5')

module.exports = (name, options) => {
  const BUSINESS = (json5.parse(options.BUSINESS_TAG) || [])
  return {
    name: 'tagList',
    type: 'checkbox',
    message: `请选择组件标签：`,
    description: `如果标签不够用， 请联系相关人`,
    choices: function ({businessList}) {
      for (let i = 0; i < BUSINESS.length; i++) {
        if (BUSINESS[i].business === businessList){
          return BUSINESS[i].tagList
        }
      }
      return []
    },
    validate: function (a) {
      if (a.length) {
        return true
      } else {
        console.log('组件标签为必选项')
        return false
      }
    },
    link: '/lc/npm/resource-platform/blob/master/README.md'
  }
}
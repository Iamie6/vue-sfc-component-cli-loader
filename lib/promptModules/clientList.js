const json5 = require('json5')
module.exports = (name, options) => {
  const CLIENT = json5.parse(options.CLIENT) || []
  return {
    name: 'clientList',
    type: 'checkbox',
    default: CLIENT[0],
    message: `请选择组件适用的终端：`,
    description: `如果终端不够用， 请联系相关人`,
    choices: CLIENT,
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
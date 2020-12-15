const json5 = require('json5')
module.exports = (name, options) => {
  const TYPE = json5.parse(options.TYPE) || []
  return {
    name: 'type',
    default: TYPE[0],
    type: 'list',
    message: `请选择组件 ${name} 的类型:`,
    description: `选项为接口下发,增加选项请联系相关人`,
    choices: TYPE,
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
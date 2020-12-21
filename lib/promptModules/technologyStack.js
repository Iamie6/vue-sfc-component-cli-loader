const json5 = require('json5')
module.exports = (name, options) => {
  const TECHNOLOGY = (json5.parse(options.TECHNOLOGY) || [])
  return {
    name: 'technologyStack',
    type: 'list',
    default: TECHNOLOGY[0],
    message: `请选择组件采用的技术栈：`,
    description: `如果技术栈不够用， 请联系相关人`,
    choices: TECHNOLOGY,
    link: '/lc/npm/resource-platform/blob/master/README.md'
  }
}
module.exports = (name, options) => {
  return {
    name: 'technologyStack',
    type: 'list',
    default: options.TECHNOLOGY[0],
    message: `请选择组件采用的技术栈：`,
    description: `如果技术栈不够用， 请联系相关人`,
    choices: options.TECHNOLOGY,
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
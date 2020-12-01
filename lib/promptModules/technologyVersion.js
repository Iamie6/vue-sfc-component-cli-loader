module.exports = (name, options) => {
  return {
    name: 'technologyVersion',
    type: 'input',
    default: '',
    message: `请填写采用的技术栈的版本(可为空)：`,
    description: `如果技术栈不够用， 请联系相关人`,
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
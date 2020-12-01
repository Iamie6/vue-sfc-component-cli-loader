module.exports = (name, options) => {
  return {
    name: 'type',
    default: options.TYPE[0],
    type: 'list',
    message: `请选择组件 ${name} 的类型:`,
    description: `选项为接口下发,增加选项请联系相关人`,
    choices: options.TYPE,
    link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
  }
}
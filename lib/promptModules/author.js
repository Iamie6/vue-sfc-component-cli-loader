module.exports = (name, options) => {
  return {
    name: 'author',
    type: 'input',
    message: `请填写邮箱前缀：`,
    description: `有疑问请联系相关人`,
    validate: function (a) {
      if(/^\w+(\d+)?$/.test(a)) {
        return true
      } else {
        console.log(' 的格式不正确,例: xingming45')
        return false
      }
    },
    link: '/lc/npm/resource-platform/blob/master/README.md'
  }
}
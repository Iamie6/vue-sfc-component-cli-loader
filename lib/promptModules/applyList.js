module.exports = (name, options) => {
  return {
    name: 'applyList',
    type: 'input',
    message: `请填写组件数据统计使用的神策event_id：`,
    description: `有疑问请联系相关人`,
    validate: function (a) {
      if(a.length > 3) {
        return true
      } else {
        console.log(' event_id 为必填项')
        return false
      }
    },
    link: '/lc/npm/resource-platform/blob/master/README.md'
  }
}
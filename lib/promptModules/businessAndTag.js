const json5 = require('json5')
module.exports = (name, options) => {
    const rows = (json5.parse(options.BUSINESS_TAG) || []).map(b => {
      return {
        name: b.business,
        value: b.tagList
      }
    })
    return {
      name: 'business',
      type: 'table',
      message: `请选择业务线 & 组件标签`,
      description: `有疑问请联系相关人`,
      rows: rows,
      link: 'https://code.vipkid.com.cn/lc/npm/resource-platform/blob/master/README.md'
    }
  }
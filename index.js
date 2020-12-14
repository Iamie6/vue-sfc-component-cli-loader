const baseInfo = require('./lib/baseInfo')

function loader (source) {
  baseInfo(source)
  return ''
}
module.exports = loader
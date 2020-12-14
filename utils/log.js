const log4js = require('log4js')
log4js.configure({
  appenders:{ 
    "upload-res": { type: 'file', filename: 'build.log' },
    "upload-output": { type: 'file', filename: 'build.log' }
  },
  categories: {
    default: {
      appenders: ['upload-res'],
      level: 'info'
    }
  }
})

module.exports = function (type) {
  return log4js.getLogger(type)
}
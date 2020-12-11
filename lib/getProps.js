const fs = require('fs')
const { parser } = require('@vuese/parser')
module.exports = function (filePath) {
  if(fs.existsSync(filePath)) {
    const source = fs.readFileSync(filePath, 'utf-8')
    try {
      let parserRes = parser(source)
      let props = parserRes.props || []
      props && props.map((props) => {
        props.default = props.default? props.default.replace(/[\n]/g,'') : props.default
        props.describe = props.describe && props.describe.filter(describe => {
          if(/^(label|tag|edit)/.test(describe)){
            let a = describe.split('=')
            props[a[0].trim()] = a[1].trim()
            return false
          }
          return true
        })
      })
      return props
    } catch(e) {
      console.error('can not parser ' + filePath)
      console.error(e)
      process.exit(1)
    }
  } else {
    console.error(filePath + ' is not a file')
    process.exit(1)
  }
}
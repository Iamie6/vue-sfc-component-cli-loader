const fs = require('fs')
const { parser } = require('@vuese/parser')
const compiler = require('vue-template-compiler')
const { compileTemplate } = require('@vue/component-compiler-utils');
module.exports = function (filePath) {
  if(fs.existsSync(filePath)) {
    const source = fs.readFileSync(filePath, 'utf-8')
    let _props = getPropsFromVueLoader(source)
    let props = getPropsFromVuese(source, _props)
    return props
  } else {
    console.error(filePath + ' is not a file')
    process.exit(1)
  }
}

function getPropsFromVuese (source, _props = {}) {
  try {
    let parserRes = parser(source)
    let props = parserRes.props || []
    props && props.map((props) => {
      props.default = props.default? props.default.replace(/[\n]/g,'') : props.default
      if (props.default) {
        if (props.type === 'Object' || props.type === 'Array') {
          try {
            let d = _props[props.name].default
            props.default = d
          } catch (e) {
            console.log(e)
          }
        }
      }
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
}

function getPropsFromVueLoader (source) {
  const {
    template,
    script,
    errors
  } = compiler.parseComponent(source)

  let scriptStr = script.content.trim()


  if (scriptStr) {
    scriptStr = scriptStr.replace(/export\s+default/, 'const democomponentExport =')
  } else {
    scriptStr = 'const democomponentExport = {}'
  } 

  const demoComponentContent = `(function() {
    ${scriptStr}
    return {
      ...democomponentExport
    }
  })()`

  let props = {}
  try {
    props = eval(demoComponentContent).props
  } catch (e) {
    console.log(e)
    console.log()
    console.log()
    console.log('获取mock数据失败')
  }
  return props
}
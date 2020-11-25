const compiler = require('vue-template-compiler')
const { compileTemplate } = require('@vue/component-compiler-utils');
const fs = require('fs')

module.exports = function (sourcePath) {
  const source = fs.readFileSync(sourcePath, 'utf-8')
  const {
    template,
    script,
    styles,
    coustomBlocks,
    errors
  } = compiler.parseComponent(source)

  let scriptStr = script.content.trim()
  if (scriptStr) {
    scriptStr = scriptStr.replace(/export\s+default/, 'const democomponentExport =')
  } else {
    scriptStr = 'const democomponentExport = {}'
  } 

  const finalOptions = {
    source: `${template.content}`,
    filename: 'inline-component',
    compiler
  };

  const attrs = compileTemplate(finalOptions).ast.attrs

  const demoComponentContent = `(function() {
    ${scriptStr}
    return {
      ...democomponentExport
    }
  })()`

  let mock = {}
  let mockData = {}

  try {
    mockData = eval(demoComponentContent).data()
  } catch (e) {
    console.log(e)
    console.log()
    console.log()
    console.log('获取mock数据失败')
  }

  attrs.map(attr => {
    mock[attr.name] = mockData[attr.value]
  })

  return mock
}
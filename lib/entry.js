const fs = require('fs')
const path = require('path')
const render = require('json-templater/string')
const uppercamelcase = require('uppercamelcase')
const endOfLine = require('os').EOL

const IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index.js\';'
const COMPONENT_TEMPLATE = '  {{name}}';
const TEMP = `{{include}}

const components = [
{{componet}}
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install,
{{list}}
}

export {
{{list}}
}`

const importStr = []
const componentStr = []
const listStr = []
const packageFolderName = './packages'
module.exports = function (names, option = {}, config) {
  names.map((packageName) => {
    const name = uppercamelcase(packageName)
    importStr.push(render(IMPORT_TEMPLATE,{
      name: name,
      package: packageName
    }))
    componentStr.push(render(COMPONENT_TEMPLATE,{
      name: name
    }))
    listStr.push(`  ${name}`)
  })
  const template = render(TEMP, {
    include: importStr.join(endOfLine),
    componet: componentStr.join( ','+ endOfLine),
    list: listStr.join(',' + endOfLine)
  })
  if (option.env == 'dev') {
    fs.writeFileSync('./examples/entry.js', template)
  } else {
    fs.writeFileSync('./src/index.js', template)
  }
}

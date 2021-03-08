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

export {
  install,
{{list}}
}`

const packages = fs.readdirSync('./packages').filter((package)=>{
  if(/^\./.test(package)) return false
  return true
})


const importStr = []
const componentStr = []
const listStr = []
packages.map((package) => {
  const name = uppercamelcase(package)

  importStr.push(render(IMPORT_TEMPLATE,{
    name: name,
    package: package
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

fs.writeFileSync('./src/index.js', template)
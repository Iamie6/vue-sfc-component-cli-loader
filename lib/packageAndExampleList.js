const fs = require('fs')
const path = require('path')
const render = require('json-templater/string')

const EXAMPLE_TEMP = `
    {{exampleName}},`
const PACKAGE_TEMP =  `
  {{name}}: [{{exampleNameList}}
  ]`
const TEMP = `let packageAndExamples = { {{packageAndExampleList}}
}

export default packageAndExamples
`

const packages = fs.readdirSync('./packages').filter((package)=>{
  if(/^\./.test(package)) return false
  return true
})

const exampleListStr = []
packages.map((package) => {
  let exampleNameStr = ''
  fs.readdirSync('./packages/' + package + '/example').map(example => {
    exampleNameStr += render(EXAMPLE_TEMP, {
      exampleName: '"' + example.replace(/\.vue$/, '') + '"'
    })
  })
  exampleListStr.push(render(PACKAGE_TEMP, {
    name: '"' + package + '"',
    exampleNameList:  exampleNameStr
  }))
})

const template = render(TEMP, {
  packageAndExampleList: exampleListStr.join(',')
})

fs.writeFileSync('./src/packageAndExamples.js', template)
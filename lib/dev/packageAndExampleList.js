const fs = require('fs')
const path = require('path')
const endOfLine = require('os').EOL
const render = require('json-templater/string')

const EXAMPLE_TEMP = `
    {{exampleName}},`
const PACKAGE_TEMP =  `
  {{name}}: [{{exampleNameList}}
  ]`
const TEMP = `let packageAndExamples = { {{packageAndExampleList}}
}

let docs = [
{{names}}
]

export {
  docs
}

export default packageAndExamples
`

const exampleListStr = []

module.exports = function (names, docsNames) {
  names.map((package) => {
    let exampleNameStr = ''
    fs.readdirSync('./packages/' + package + '/example').filter(filterDS).map(example => {
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
    packageAndExampleList: exampleListStr.join(','),
    names: docsNames.map(n => '"'+ n +'"').join(','+ endOfLine)
  })

  function filterDS (path) {
    if(/^\./.test(path)) return false
    return true
  }

  fs.writeFileSync('./examples/packageAndExamples.js', template)
}

const fs = require('fs')
const packageFolderName = './packages'
const docsStr = require('./docsStr')

module.exports = function (names) {
    console.log(names)
    names.map(name => {
        let path = packageFolderName + '/' + name
        let str = docsStr(path)
        fs.writeFileSync(`${path}/docs.md`, str, 'utf-8')
    })
}
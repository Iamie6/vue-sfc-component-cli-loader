const compiler = require('vue-template-compiler')
const fs = require('fs')
module.exports = function (path) {
    const source = fs.readFileSync(path, 'utf-8')
    // {
    //     template,
    //     script,
    //     styles,
    //     coustomBlocks,
    //     errors
    // }
    return compiler.parseComponent(source)
}
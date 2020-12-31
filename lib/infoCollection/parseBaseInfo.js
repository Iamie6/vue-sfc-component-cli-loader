const compiler = require('./compiler')
module.exports = function (name) {
    const indexPath = `./packages/${name}/src/index.vue`
    const { customBlocks } = compiler(indexPath)
    const customContent =  customBlocks[0] ? customBlocks[0].content: ''
    const info = eval(`(function () { ${customContent} return ${name} })()`)
    
    return info
}
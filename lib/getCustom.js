const fs = require('fs')
module.exports = function (content, name) {
    let customData = content.customData || {}
    fs.writeFileSync(`./dist/uploadInfo/custom-${name}.json`, JSON.stringify(customData))
}
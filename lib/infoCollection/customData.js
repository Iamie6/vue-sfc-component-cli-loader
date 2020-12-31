const fs = require('fs')
const baseInfo = require('./parseBaseInfo')
module.exports = function (names) {
    names.map(name => {
        const info = baseInfo(name)
        let customData = info.customData || {}
        fs.writeFileSync(`./dist/uploadInfo/custom-${name}.json`, JSON.stringify(customData))
    })
}
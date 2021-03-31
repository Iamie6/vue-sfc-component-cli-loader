const fs = require('fs')
const rm = require('rimraf')
const outputPath = './dist'
const basePath = './dist/uploadInfo'
const baseInfoFile= './dist/uploadInfo/baseInfo.json'
module.exports = function () {
    rm.sync(outputPath, {})
    fs.mkdirSync(outputPath)
    fs.mkdirSync(basePath)
    fs.writeFileSync(baseInfoFile, '{}')
}
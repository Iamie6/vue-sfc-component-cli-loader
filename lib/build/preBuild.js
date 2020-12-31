const fs = require('fs')
const outputPath = './dist'
const basePath = './dist/uploadInfo'
const baseInfoFile= './dist/uploadInfo/baseInfo.json'
module.exports = function () {
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath)
    }
    if(!fs.existsSync(basePath)){
        fs.mkdirSync(basePath)
    }
    fs.writeFileSync(baseInfoFile, '{}')
}
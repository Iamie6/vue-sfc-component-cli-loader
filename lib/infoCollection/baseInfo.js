const fs = require('fs')
const baseInfoFile= './dist/uploadInfo/baseInfo.json'
const lowwerCase = require('../../utils/formatName')
const remote = require('../../utils/repository')()
const baseInfo = require('./parseBaseInfo')
module.exports = function (names) {
    names.map(name => {
        const info = baseInfo(name)
        writeFile(info, name)
    })
}

function writeFile(content, name) {
    let baseInfo = JSON.parse(fs.readFileSync(baseInfoFile,'utf-8'))
    try {
        delete content.customData
        content.name = name
        content.$name = lowwerCase(name)
        content.repositoryName = remote.name
        content.repositoryUrl = remote.url
        baseInfo[name] = content
        fs.writeFileSync(baseInfoFile, JSON.stringify(baseInfo))
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}
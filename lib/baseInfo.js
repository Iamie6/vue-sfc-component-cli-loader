const fs = require('fs')
const outputPath = './dist'
const basePath = './dist/uploadInfo'
const baseInfoFile= './dist/uploadInfo/baseInfo.json'
const lowwerCase = require('../utils/formatName')
const customData = require('./getCustom')
const remote = require('../utils/repository')()
let list = fs.readFileSync('./src/packageAndExamples.js', 'utf-8')

module.exports = function (source) {
    list = list.replace(/let[\s\S]packageAndExamples[\s\S]=/, 'packageAndExamples =').replace(/export[\s\S]default[\s\S]+$/, '')
    var packageAndExamples = {}
    eval(list)
    let keys = Object.keys(packageAndExamples)
    const res = source.match(/const([\s\S]+)=([\s\S]+)/)
    if (!res || !res[1] || !res[2]){
        console.log(source)
    } else {
        const name = res[1].trim()
        if (keys.includes(name)) {
            eval("var c = " +res[2])
            const content = c
            writeFile(content, name)
            customData(content, name)
        }
        return ''
    }
}

function writeFile(content, name) {
    let baseInfo = {}
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath)
    }
    if(!fs.existsSync(basePath)){
        fs.mkdirSync(basePath)
    }
    if(fs.existsSync(baseInfoFile)) {
        baseInfo = JSON.parse(fs.readFileSync(baseInfoFile,'utf-8'))
    }
    try {
        delete content.customData
        content.name = name
        content.$name = lowwerCase(name)
        content.test = ""
        content.testReport = ""
        content.repositoryName = remote.name
        content.repositoryUrl = remote.url
        baseInfo[name] = content
        fs.writeFileSync(baseInfoFile, JSON.stringify(baseInfo))
        // fs.writeFileSync(`./dist/uploadInfo/custom-${name}.json`, JSON.stringify(customData))
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}
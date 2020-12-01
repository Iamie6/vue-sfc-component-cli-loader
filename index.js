const fs = require('fs')
const outputPath = './dist'
const basePath = './dist/uploadInfo'
const baseInfoFile= './dist/uploadInfo/baseInfo.json'
const remote = require('./utils/repository')()

function loader (source) {
  const res = source.match(/const([\s\S]+)=([\s\S]+)/)
  if (!res || !res[1] || !res[2]){
    console.log(source)
  } else {
    const name = res[1].trim()
    eval("var c = " +res[2])
    const content = c
    writeFile(content, name)
    return ''
  }
}

function writeFile (content, name) {
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
    const customData = content.customData
    delete content.customData
    content.name = name
    content.repositoryName = remote
    content.repositoryUrl = `https://code.vipkid.com.cn/${remote}.git`
    baseInfo[name] = content
    fs.writeFileSync(baseInfoFile, JSON.stringify(baseInfo))
    fs.writeFileSync(`./dist/uploadInfo/custom-${name}.json`, JSON.stringify(customData))
  } catch (e) {
    console.log(e)
  }
}

module.exports = loader
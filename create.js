#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = '>=8.9'

function checkNodeVersion (wanted) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but  requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion)

const fs = require('fs')
const minimist = require('minimist')
const program = require('commander')

// 创建文件夹
program
  .command('create [dirs...]')
  .description('create a new component folder by cli')
  .action((dirs) => {
    require('./lib/createFolder')(dirs)
  })

// 创建入口文件
program
  .command('entry')
  .description('create entry.js by cli')
  .action(() => {
    require('./lib/packageAndExampleList')
    require('./lib/entry')
  })

// 创建入口文件
program
  .command('docs')
  .description('create docs by cli')
  .action(() => {
    require('./lib/createDocs')
  })

// 获取mock数据
program
  .command('getInfo')
  .description('get data from "packages/example & packages/src" folder by cli')
  .action(() => {
    const getMockData = require('./lib/getMockData')
    const getProps = require('./lib/getProps.js')
    if (!fs.existsSync('./dist')){
      fs.mkdirSync('./dist')
    }
    if (!fs.existsSync('./dist/uploadInfo')) {
      fs.mkdirSync('./dist/uploadInfo')
    }

    const components = fs.readdirSync('./packages').filter(folderName => {
      if (/^\./.test(folderName)) {
        return false
      }
      return true
    })
    components.map(component => {
      const example = fs.readdirSync(`./packages/${component}/example`)[0]
      const mock = getMockData(`./packages/${component}/example/${example}`)
      const props = getProps(`./packages/${component}/src/index.vue`)
      fs.writeFileSync(`./dist/uploadInfo/props-${component}.json`, JSON.stringify(props))
      fs.writeFileSync(`./dist/uploadInfo/mock-${component}.json`, JSON.stringify(mock))
    })
  })

program.on('--help', () => {
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

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

const minimist = require('minimist')
const program = require('commander')

// 创建文件夹
program
  .command('create')
  .description('create a new component folder by cli')
  .action(() => {
    const componentNames = minimist(process.argv.slice(3))._
    require('./lib/createFolder')(componentNames)
    require('./lib/packageAndExampleList')
    require('./lib/entry')
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
  .command('getMock')
  .description('get mock data from examples by cli')
  .action(() => {
    const getMockData = require('./lib/getMockData')
    const mock = getMockData('./packages/baseButton/example/exampleOfPosition.vue')
    console.log(mock)
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

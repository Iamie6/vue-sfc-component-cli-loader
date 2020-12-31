#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = '>=8.9'
const packageFolderName = './packages'

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
function getFileNames (names) {
  if (!names) {
    names = []
  } else if (!Array.isArray(names)){
      names = [names]
  }
  if (names.length === 0) {
      names = fs.readdirSync(packageFolderName).filter(name => {
          if(/^\./.test(name)) return false
          return true
      })
  }
  return names
}

// 创建文件夹
program
  .command('create [dirs...]')
  .description('create a new component folder by cli')
  .action((dirs) => {
    require('./lib/createFolder')(dirs)
  })

// 创建文档
program
  .command('docs [names...]')
  .description('create docs by cli')
  .action((names) => {
    require('./lib/docs/docs-creator.js')(getFileNames(names))
  })

// docs server
program
  .command('docs-server [names...]')
  .description('docs-server by cli')
  .action((names) => {
    require('./lib/docs/docs-server.js')(getFileNames(names))
  })

// props 收集
program
  .command('props [names...]')
  .description('props by cli')
  .action((names) => {
    require('./lib/infoCollection/getProps.js')(getFileNames(names))
  })

// mock 收集
program
  .command('mockdata [names...]')
  .description('mockdata by cli')
  .action((names) => {
    require('./lib/infoCollection/getMockData.js')(getFileNames(names))
  })

// baseInfo 收集
program
  .command('baseInfo [names...]')
  .description('baseInfo by cli')
  .action(names => {
    require('./lib/infoCollection/baseInfo.js')(getFileNames(names))
  })

// custom 收集
program
  .command('customData [names...]')
  .description('custom by cli')
  .action(names => {
    require('./lib/infoCollection/customData.js')(getFileNames(names))
  })

// 创建入口文件
program
  .command('entry [names...]')
  .description('create entry.js by cli')
  .action(names => {
    require('./lib/entry.js')(getFileNames(names))
  })

// 创建example对应列表
program
  .command('examples [names...]')
  .description('create examples by cli')
  .action(names => {
    require('./lib/dev/packageAndExampleList.js')(getFileNames(names))
  })

//TODO testInfo 
program
  .command('testInfo [names...]')
  .description('testInfo by cli')
  .action((names) => {
    console.log(names)
  })

//TODO test
program
  .command('test [names...]')
  .description('test components by cli')
  .action((names) => {
    console.log(names)
  })

// build
program
  .command('build [names...]')
  .option('-e, --entry', '自定义组件库总入口文件(/src/index.js)')
  .option('-u, --upload <path>', 'upload配置参数')
  .description('build components by cli')
  .action((names, cmdObj) => {
    const option = cleanArgs(cmdObj)
    names = getFileNames(names)
    require('./lib/build/preBuild')()
    if (!option.entry) {
      require('./lib/entry')(names)
    }
    require('./lib/docs/docs-creator.js')(names)
    require('./lib/infoCollection/getProps.js')(names)
    require('./lib/infoCollection/customData.js')(names)
    require('./lib/infoCollection/getMockData.js')(names)
    require('./lib/infoCollection/baseInfo.js')(names)
  })

// dev
program
  .command('dev [names...]')
  .description('dev  by cli')
  .action(names => {
    names = getFileNames(names)
    require('./lib/entry')(names, 'dev')
    require('./lib/dev/packageAndExampleList.js')(names)
    require('./lib/docs/docs-server.js')(names)
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

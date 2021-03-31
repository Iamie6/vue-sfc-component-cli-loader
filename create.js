#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = '>=8.9'
const packageFolderName = './packages'
const path = require('path')
const root = process.cwd()
const resolvedPath = path.resolve(root, './build/cli.config.js')
const userConfig = require(resolvedPath)

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
const program = require('cac')()
function getFileNames (names) {
  if (!names) {
    names = []
  } else if (!Array.isArray(names)){
      names = [names]
  }
  // if (names.length === 0) {
  //     names = fs.readdirSync(packageFolderName).filter(name => {
  //         if(/^\./.test(name)) return false
  //         return true
  //     })
  // }
  return names
}

function getAllPackages () {
  return fs.readdirSync(packageFolderName).filter(name => {
    if(/^\./.test(name)) return false
    return true
  })
}

program
  .option('--env [env]', `['dev' | 'prod']`)

// 创建文件夹
program
  .command('create [dirs...]')
  .action((dirs, cmdObj) => {
    const option = cleanArgs(cmdObj)
    const names = getFileNames(dirs)
    require('./lib/createFolder')(names, option, userConfig)
  })

// 创建文档 <done>
program
  .command('docs [names...]')
  .action((names) => {
    require('./lib/docs/docs-creator.js')(getFileNames(names))
  })

// docs server <done>
program
  .command('docs-server [names...]')
  .action((names) => {
    require('./lib/docs/docs-server.js')(getFileNames(names), true)
  })

// props 收集
program
  .command('props [names...]')
  .option('--d [div]')
  .action((names, option) => {
    console.log(option)
    return
    require('./lib/infoCollection/getProps.js')(getFileNames(names))
  })

// mock 收集
program
  .command('mockdata [names...]')
  .action((names) => {
    require('./lib/infoCollection/getMockData.js')(getFileNames(names))
  })

// baseInfo 收集
program
  .command('baseInfo [names...]')
  .action(names => {
    require('./lib/infoCollection/baseInfo.js')(getFileNames(names))
  })

// custom 收集
program
  .command('customData [names...]')
  .action(names => {
    require('./lib/infoCollection/customData.js')(getFileNames(names))
  })

// 创建入口文件 <done>
program
  .command('entry [names...]')
  .action(names => {
    require('./lib/entry.js')(getFileNames(names))
  })

// // 创建example对应列表
// program
//   .command('examples [names...]')
//   .action(names => {
//     require('./lib/dev/packageAndExampleList.js')(getFileNames(names))
//   })

//TODO testInfo 
program
  .command('testInfo [names...]')
  .action((names) => {
    console.log(names)
  })

//TODO test
program
  .command('test [names...]')
  .action((names) => {
    console.log(names)
  })

// prebuild <done>
program
  .command('prebuild [names...]')
  .option('-u, --upload', 'upload配置参数')
  .action((names, option) => {

    require('./lib/build/preBuild')()
    // let docsNames = names
    // option.env = option.env || 'prod'
    // const config = userConfig[option.env]
    // return
    // if(typeof config.docs === 'object') {
    //   let include = ((config.docs && config.docs.include) || []).map(name =>{
    //     return name.toLocaleLowerCase()
    //   })
    //   let exclude = ((config.docs && config.docs.exclude) || []).map(name =>{
    //     return name.toLocaleLowerCase()
    //   })
    //   if (include.length) {
    //     docsNames = names.filter(name => {
    //       let n = name.toLocaleLowerCase()
    //       if(include.indexOf(n) > -1) return true
    //       return false
    //     })
    //   } else {
    //     docsNames = names.filter(name => {
    //       let n = name.toLocaleLowerCase()
    //       if(exclude.indexOf(n) > -1) return false
    //       return true
    //     })
    //   }
    // }
    // require('./lib/docs/docs-creator.js')(docsNames)
    
    // // require('./lib/infoCollection/baseInfo.js')(names)
    // // require('./lib/infoCollection/getProps.js')(names)
    // // require('./lib/infoCollection/customData.js')(names)
    // // require('./lib/infoCollection/getMockData.js')(names)
    // if (options.upload) {
    //   require('./lib/upload.js')(names)
    // }
  })

// dev <done>
program
  .command('dev [names...]')
  .option('-d, --docs', '是否开启docs预览')
  .action((names, option) => {
    names = getFileNames(names)
    option.env = option.env || 'dev'
    const config = userConfig[option.env]
    // names 命令传参 优先级最高
    if (!names.length) {
      let include = (config.deploy && config.deploy.include) || []
      let exclude = (config.deploy && config.deploy.exclude) || []
      exclude = exclude.map(n => {
        return n.toLocaleLowerCase()
      })
      if (include.length) {
        names = include
      } else {
        names = getAllPackages().filter( name => {
          let n = name.toLocaleLowerCase()
          if(exclude.indexOf(n) > -1) return false
          return true
        })
      }
    }
    require('./lib/entry')(names, option, config)
    // option.docs  命令行参数  优先级最高
    // 其次config 中的配置
    // 默认 全部
    let docsNames = getAllPackages()
    if (option.docs) { // 全部组件 自动生成文档
    } else if (config.docs === true) { // 全部组件 自动生成文档
    } else if (config.docs === false) { // 全部组件 不自动生成文档
      docsNames = []
    } else if (config.docs === undefined) { // 参与组件 自动生成文档
      docsNames = names
    } else {
      let include = ((config.docs && config.docs.include) || []).map(name =>{
        return name.toLocaleLowerCase()
      })
      let exclude = ((config.docs && config.docs.exclude) || []).map(name =>{
        return name.toLocaleLowerCase()
      })
      if (include.length) {
        docsNames = names.filter(name => {
          let n = name.toLocaleLowerCase()
          if(include.indexOf(n) > -1) return true
          return false
        })
      } else {
        docsNames = names.filter(name => {
          let n = name.toLocaleLowerCase()
          if(exclude.indexOf(n) > -1) return false
          return true
        })
      }
    }
    require('./lib/dev/packageAndExampleList.js')(names, docsNames, option, config)
    require('./lib/docs/docs-server.js')(docsNames, true)
    // require('./lib/dev/dev')(option, config)
  })

program.on('--help', () => {
})


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

const execSync = require('child_process').execSync
const branchCommand = 'git remote -v'
const remote = execSync(branchCommand).toString()
const chalk = require('chalk')
const repositoryName = remote.match(/\.com\.cn(:\d+)?\/(.*)\.git/)

module.exports = function () {
  if (!repositoryName) {
    console.log(chalk.red('本项目没有关联远程仓库'))
  }
  if (repositoryName.length>1) {
    return repositoryName[2]
  } else {
    return '@mit'
  }
}
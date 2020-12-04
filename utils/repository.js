const execSync = require('child_process').execSync
const repositoryCommand = 'git remote -v'
const userCommand = 'git config user.name'
const chalk = require('chalk')

module.exports = function () {
  const remote = execSync(repositoryCommand).toString()
  const user = execSync(userCommand).toString()
  const repositoryName = remote.match(/\.com\.cn(:\d+)?\/(.*)\.git/)
  if (repositoryName && repositoryName.length>1) {
    return repositoryName[2]
  } else {
    if (!user) {
      console.log(chalk.red('目前的仓库需要关联远程仓库。 \n 或者通过git config --global user.name "username" 添加用户名'))
      process.exit(1)
    }
    return `mit/${user}`
  }
}
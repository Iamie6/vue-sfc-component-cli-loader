const execSync = require('child_process').execSync
const branchCommand = 'git remote -v'
const remote = execSync(branchCommand).toString()

const repositoryName = remote.match(/3590\/(.*)\.git/)

module.exports = function () {
  if (repositoryName.length>1) {
    return repositoryName[1]
  } else {
    return '@mit'
  }
}
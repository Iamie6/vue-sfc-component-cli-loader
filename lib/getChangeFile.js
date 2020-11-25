
// 变更 文件
const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const branchCommand = 'git rev-parse --abbrev-ref HEAD'

const branch = execSync(branchCommand).toString().trim()
const changFileCommand = `git diff --stat remotes/origin/master ${branch}`

const Files = execSync(changFileCommand).toString()


const jsFiles = []
const FILE = /(\S)+ /g
const _files = Files.match(FILE)

const len = _files.length

let i = 0;
while (i < len) {
  const _item = _files[i++].trim()
  if (!/index.js$/.test(_item)) continue
  const item = './' + _item
  if (!/^\.\/packages\//.test(item)) continue;
  jsFiles.push(item);
}

if (jsFiles.length === 0) {
  console.log('没有文件发生变化');
  console.log('');
  process.exit(1);
}

console.log('------------------------------');
console.log('     以下文件发生改变： ');
console.log(jsFiles.join('\n'));
console.log('------------------------------');

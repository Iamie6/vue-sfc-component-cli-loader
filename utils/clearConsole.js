const readline = require('readline')
exports.clearConsole = function (title) {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}
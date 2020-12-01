class Loop {
  constructor () {
    this.stack = []
    this.lock = false
  }

  push (task) {
    this.stack.push(task)
    this.queue()
  }

  queue () {
    if (this.lock) return
    this.lock = true
    let task = this.stack.shift()
    while (task) {
      task()
      task = this.stack.shift()
    }
    this.lock = false
  }
}

module.exports = Loop
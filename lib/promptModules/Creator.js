const inquirer = require('inquirer')
inquirer.registerPrompt("table", require("../plugin/inquiry-table-prompt"));
module.exports = class Creator {
  constructor(name, options) {
    this.name = name
    this.options = options
  }

  async create () {
    const questions = this.resolveFinalPrompts().map(question=>{
      return question(this.name, this.options)
    })
    const res = await inquirer.prompt(questions)
    return res
  }

  resolveFinalPrompts () {
    return [
      'version',
      'type',
      'author',
      'clientList',
      'businessAndTag',
      'technologyStack',
      'technologyVersion',
      'applyList',
      'label',
      'description',
    ].map(file => require(`./${file}`))
  }
}
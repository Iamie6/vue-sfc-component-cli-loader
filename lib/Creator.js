const inquirer = require('inquirer')

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
      'tagList',
      'clientList',
      'technologyStack',
      'technologyVersion',
      'businessList',
      'applyList',
      'description'
    ].map(file => require(`../lib/promptModules/${file}`))
  }
}
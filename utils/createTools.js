exports.getPromptModules = () => {
  return [
    'version',
    'type',
    // 'author',
    // 'tagList',
    // 'clientList',
    // 'technologyStack',
    // 'technologyVersion',
    // 'businessList',
    // 'applyList',
    // 'description',
    // 'customData'
  ].map(file => require(`../lib/promptModules/${file}`))
}
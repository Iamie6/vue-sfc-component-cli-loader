module.exports = (name, options) => {
    return {
        name: 'label',
        type: 'input',
        message: `请填写${name} 的label(可为空):`,
        description: `有疑问请联系相关人`,
        link: '/lc/npm/resource-platform/blob/master/README.md'
    }
}
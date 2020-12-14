function lowwerCase(name) {
    return name.replace(/[A-Z]/g, (item) => {
        return '-' + item.toLocaleLowerCase()
    }).replace(/^-/, '')
}

module.exports = lowwerCase
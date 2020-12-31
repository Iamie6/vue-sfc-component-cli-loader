const watch = require('node-watch')
const packageFolderName = './packages'
const createDocs = require('./docs-creator')
const fs = require('fs')

module.exports = function (names) {
    let folder = packageFolderName + '/'
    const files = names.map(name => {
        return folder + name + '/'
    })
    watch(files.length ? files : folder, {
        recursive: true,
        filter: /\.vue$/,
        delay: 500
    }, function(evt, name) {
        createDocs(name.split('/')[1])
    })
}

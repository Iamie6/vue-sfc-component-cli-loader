const webpack = require('webpack')
const buildConfig= require('buildConfig')
const packageFolderName = './packages'
const fs = require('fs')
module.exports = function (names) {
    if (names.length === 0) {
        names = fs.readdirSync(packageFolderName).filter(name => {
            if(/^\./.test(package)) return false
            return true
        })
    }
}
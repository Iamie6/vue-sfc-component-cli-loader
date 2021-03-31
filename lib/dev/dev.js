'use strict'

const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')

module.exports = function (option, config) {
    const webpackConfig = config.webpack
    const spinner = ora('building for development...')
    spinner.start()
    const compiler = webpack(webpackConfig,(err, stats) => {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  dev failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  server start.\n'))
    })
}


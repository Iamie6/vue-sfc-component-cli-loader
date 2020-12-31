const { parser } = require('@vuese/parser')
const Render = require('@vuese/markdown-render')
const fs = require('fs')
// 生成 table
/**
 * 
 * @param {string} filePath Single File Components 文件地址
 */
function toTableStr(filePath) {
    if (fs.existsSync(filePath)) {
        const source = fs.readFileSync(filePath, 'utf-8')
        try {
            let parserRes = parser(source)
            parserRes.props && parserRes.props.map((props) => {
                props.default = props.default ? props.default.replace(/[\n]/g, '') : props.default
                props.describe = props.describe && props.describe.filter(describe => {
                    if (/^(label|tag|edit)/.test(describe)) {
                        return false
                    }
                    return true
                })
            })
            const r = new Render.default(parserRes)
            let markdownRes = r.renderMarkdown()
            const content = (markdownRes && markdownRes.content) ? markdownRes.content.replace(/\<!-- @vuese.+?--\>/g, '') : null
            return content
        } catch (e) {
            console.error('can not parser ' + filePath)
            console.error(e)
            process.exit(1)
        }
    } else {
        console.error(filePath + ' is not a file')
        process.exit(1)
    }
}

// example 转markdown
function exampleToMarkdown(folderPath) {
    if (fs.existsSync(folderPath)) {
        const exampleFiles = fs.readdirSync(folderPath)
        let str = ''
        exampleFiles.map(item => {
            let fileData = fs.readFileSync(`${folderPath}/${item}`, "utf-8")
            // 提取描述
            if (fileData.match(/\<!--[\s\S]+?--\>/)) {
                let description = fileData.match(/\<!--([\s\S]+?)--\>/)[1]
                str += `${description}\n`
                str += `\`\`\`html\n${fileData.replace(/\<!--[\s\S]+?--\>/, '')}\n\`\`\``
                str += '\n'
            } else {
                str += '\n'
                str += `\`\`\`html\n${fileData}\n\`\`\``
                str += '\n'
            }
        })
        return str
    } else {
        console.error(folderPath + ' is not a folder')
        process.exit(1)
    }
}

module.exports = function (componentPath) {
    const contentTable = toTableStr(componentPath + '/src/index.vue')
    const contentExample = exampleToMarkdown(componentPath + '/example')

    return contentExample + contentTable
}
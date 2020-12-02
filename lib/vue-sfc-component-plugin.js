const id = 'vue-sfc-component-plugin'
const fs = require('fs')
const Loop = require('../utils/eventLoop')
const remote = require('../utils/repository')()
class VueSFCComponentPlugin {
  constructor (options = {}) {
    this.vvos = options.vvos
    this.option = options.option
    this.domian = options.publicPath.replace(/\.com\.cn\/(.*)/, '.com.cn/')
    this.componentInfo = []
    this.componentInfoObj = {}
    this.loop = new Loop()
    this.outputFiles = []
    this.timer = null
  }

  apply (compiler) {
    compiler.hooks.done.tap(id, (stats) => {
      const baseInfo = JSON.parse(fs.readFileSync('./dist/uploadInfo/baseInfo.json', 'utf-8'))
      for (let name in baseInfo){
        this.uploadFile(baseInfo[name], this.together, this.createFile)
        this._uploadOutput('./dist/output')
      }
    })
  }

  uploadFile (content, fn, callback) {
    let files = this.getFileList(content)
    let _fn = fn.bind(this, content, callback)
    for (let name in files) {
      this.vvos.default({
      ...this.option,
      cover: false,
      files: {[name] : files[name]}
    }, _fn)
    }
  }

  _uploadOutput (dir) {
    this.mapDir(dir)
    let filesOption = this.option.files
    this.outputFiles.map(file => {
      this.vvos.default({
        ...this.option,
        cover: false,
        files : {[`${filesOption + remote + '/'}${file.replace(/\.\/dist\/output\//,'')}`]: {
          fullname: file
        }}
      }, (...arg) => {
        if (arg[1] && arg[1].success){
          console.log(file + '上传成功')
        } else if (arg[0] && arg[0].success) {
          console.log(file + '上传成功')
        } else {
          console.error(file + '失败')
        }
      })
    })
  }

  together (content, callback, ...arg) {
    let objects = []
    const urls = {}
    if (arg[1] && arg[1].success) {
      objects = arg[1].objects
    }  else if (arg[0] && arg[0].success) {
      objects = arg
    } else {
      console.error('上传失败')
    }
    if (!objects.length) return
    objects.map(obj => {
      if (/docs-.+\.md$/.test(obj.key)) {
        urls.docLink = this.domian + obj.key
      }
      if (/change-.+\.md$/.test(obj.key)) {
        urls.docLogLink = this.domian + obj.key
      }
      if (/preview-.+\.png$/.test(obj.key)) {
        urls.thumbnail = this.domian + obj.key
      }
      if (/props-.+\.json$/.test(obj.key)) {
        urls.props = this.domian + obj.key
      }
      if (/mcok-.+\.json$/.test(obj.key)) {
        urls.mockData = this.domian + obj.key
      }
      if (/custom-.+\.json$/.test(obj.key)) {
        urls.customData = this.domian + obj.key
      }
      if (/\.js$/.test(obj.key)) {
        urls.cdn = this.domian + obj.key
      }
    })
    const _content = Object.assign({}, this.componentInfoObj[content.name+content.version] , content, urls)
    this.componentInfoObj[content.name+content.version] = _content
    clearTimeout(this.timer)
    this.timer = setTimeout(()=>{
      this.loop.push(callback.bind(this))
    }, 500)
  }

  createFile () {
    for(let name in this.componentInfoObj) {
      this.componentInfo.push(this.componentInfoObj[name])
    }
    const text = `{
  "list": ${JSON.stringify(this.componentInfo)}
}`
    fs.writeFileSync('./dist/componentInfo.js', text)
  }

  getFileList (content) {
    let filesOption = this.option.files + remote + '/'
    let files = {
      [`${filesOption}${content.name}/${content.name + '-' + content.version.replace(/^v/,'')}.js`]:{
        fullname:`./dist/output/${content.name}/${content.name}.js`
      },
      [`${filesOption}${content.name}/docs-${content.version.replace(/^v/,'')}.md`]: {
        fullname: `./packages/${content.name}/docs.md`
      },
      [`${filesOption}${content.name}/change-${content.version.replace(/^v/,'')}.md`]: {
        fullname: `./packages/${content.name}/change.md`
      },
      [`${filesOption}${content.name}/preview-${content.version.replace(/^v/,'')}.png`]: {
        fullname: `./packages/${content.name}/preview.png`
      },
      [`${filesOption}${content.name}/props-${content.version.replace(/^v/,'')}.json`]: {
        fullname: `./dist/uploadInfo/props-${content.name}.json`
      },
      [`${filesOption}${content.name}/mcok-${content.version.replace(/^v/,'')}.json`]: {
        fullname: `./dist/uploadInfo/mock-${content.name}.json`
      },
      [`${filesOption}${content.name}/custom-${content.version.replace(/^v/,'')}.json`]: {
        fullname: `./dist/uploadInfo/custom-${content.name}.json`
      }
    }
    return files
  }

  mapDir (dir) {
    const stat = fs.lstatSync(dir)
    if (stat.isFile()) {
      this.outputFiles.push(dir)
    }
    if (stat.isDirectory()) {
      const files = fs.readdirSync(dir)
      files.map(file => {
        this.mapDir(dir+'/'+file)
      })
    }
  }
}

module.exports = VueSFCComponentPlugin

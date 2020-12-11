const fs = require('fs')
const path = require('path')
const Creator = require('./Creator')
const render = require('json-templater/string')
const https = require('https')
const axios = require('axios')
const api = process.env.npm_package_docs_api
const _api = 'http://stage-lc-admin-vk-l5d-ac-4598.vipkid-qa.com.cn/rest/learncenter/component/getOption'
const {clearConsole} = require('../utils/clearConsole')
const chalk = require('chalk')

let resault = {
  TAGBC: [ 'layout', 'function', 'animation', 'ui' ],
  BUSINESS: [ 'ust', 'ad', 'cms' ],
  TAG: [ 'layout', 'function', 'animation', 'ui' ],
  TYPE: [ '业务组件', '基础组件', '模块', '物料' ],
  TECHNOLOGY: [ 'vue', 'js', 'react', 'img' ],
  CLIENT: [ 'pc', 'ipad', 'wx', 'mobile', 'miniProgram' ]
}

const ENTRY_TEMP =  `
import {{name}} from './src/index.vue'

{{name}}.install = function(Vue) {
  Vue.component({{name}}.name, {{name}});
};

export default {{name}};
`

const INDEX_TEMP = `<template>
  <div>我是组件{{name}}</div>
</template>
<script>
export default {
  name: "{{name}}"
}
</script>
<style>

</style>
<custom>
/**
 * @version <必填><string>            {{version}}
 * @author<必填><string>              请将此处替换成邮箱前缀
 * @type<必填><string>                单选，选项为：{{TYPE}}
 * @tagList<必填><array>              可多选，选项为：{{TAG}}
 * @clientList<必填><array>           可多选,选项为：{{CLIENT}}
 * @technologyStack<必填><string>     单选，选项为：{{TECHNOLOGY}}
 * @technologyVersion<选填><string>   当 technologyStack !=Js 时, 此项填写技术栈版本，例： 2.6.0
 * @businessList<必填><array>         可多选， 选项为：{{BUSINESS}}
 * @applyList<必填><string>           神策event_id：
 * @description<选填><string>         组件描述
 * @customData<选填><Object>          JSON
 * /
const {{name}} = {
  version: "{{version}}",
  author: "{{author}}",
  type: {{type}},
  tagList: {{tagList}},
  clientList: {{clientList}},
  technologyStack: {{technologyStack}},
  technologyVersion: {{technologyVersion}},
  businessList: {{businessList}},
  applyList: {{applyList}},
  description: {{description}},
  customData: {}
}
</custom>
`

const EXAMPLE_TEMP = `
<template>
  {{demo}}
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style>

</style>
`

const PREVIEW_TEMP = 'https://s.vipkidstatic.com/fe-static/pc/parents/img/common/header/logo-copy-5f3d71704a.png'

const DOCS_TEMP = ``
const CHANGE_TEMP = ``

const fileList = [
  'example/exam1.vue',
  'src/index.vue',
  'change.md',
  'docs.md',
  'index.js',
  'preview.png'
]


async function createComponent (name) {
  const creator = new Creator(name, resault)
  const filePath = `./packages/${name}`
  const mkdirErr = await mkdir(filePath)
  if (mkdirErr) { // 创建文件夹失败
    if (mkdirErr.code.toUpperCase() === 'EEXIST') {
      console.log('文件夹已存在')
    } else {
      console.log('创建组件目录失败，请尝试手动创建')
      console.log(mkdirErr)
    }
  } else {
    clearConsole()
    const answers = await creator.create()
    fileList.map(file => {
      const pathName = `./packages/${name}/${file}`
      switch (file) {
        case 'preview.png':
          downloadFile(pathName, PREVIEW_TEMP)
          break;
        case 'example/exam1.vue':
          mkdir(`./packages/${name}/example`, function () {
            createfile(`./packages/${name}/example/${name}.vue`, render(EXAMPLE_TEMP,{
              demo: createTag(name)
            }))
          })
          break;
        case 'src/index.vue':
          mkdir(`./packages/${name}/src`, function () {
            createfile(pathName, render(INDEX_TEMP, {
              name: name,
              BUSINESS: resault.BUSINESS.join(', '),
              TAG: resault.TAG.join(', '),
              TYPE: resault.TYPE.join(', '),
              TECHNOLOGY: resault.TECHNOLOGY.join(', '),
              CLIENT: resault.CLIENT.join(', '),
              version: `${answers.version}`,
              author: `${answers.author}`,
              type: `"${answers.type}"`,
              tagList: arrOrStrToArrStr(answers.tagList),
              clientList: arrOrStrToArrStr(answers.clientList),
              technologyStack: `"${answers.technologyStack}"`,
              technologyVersion: `"${answers.technologyVersion}"`,
              businessList: arrOrStrToArrStr(answers.businessList),
              applyList: arrOrStrToArrStr(answers.applyList),
              description: `"${answers.description}"`
            }))
          })
          break;
        case 'change.md':
          createfile(pathName, render(CHANGE_TEMP, {}))
          break;
        case 'docs.md':
          createfile(pathName, render(DOCS_TEMP, {}))
          break;
        case 'index.js':
          createfile(pathName, render(ENTRY_TEMP, {
            name: name
          }))
          break;
      }
    })
  }
}

function mkdir(dir, cb) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(err)
      } else {
        if (cb) {
          cb()
        } else {
          resolve(false)
        }
      }
    })
  })
}

function createfile (path, content) {
  fs.writeFileSync(path, content)
}

function downloadFile (path, origin) {
  const writeStream = fs.createWriteStream(path)
  https.get(origin, (res) => {
    res.pipe(writeStream)
  })
}

function createTag (name) {
  let _name = name.replace(/[A-Z]/g, (item) => {
    return '-' + item.toLocaleLowerCase()
  }).replace(/^-/, '')

  return `<${_name}></${_name}>`
}

function arrOrStrToArrStr (input) {
  if (typeof input === 'object') {
    return `[${input.map(t => `"${t}"`).join(', ')}]`
  } else {
    return `[ "${input}" ]`
  }
}

function checkName (name) {
  console.log(name)
  const reg = new RegExp('^[a-zA-Z][0-9a-zA-Z]+$')
  return reg.test(name)
}

module.exports = (componentNames) => {
  axios.get(api).then(async (res) => {
    resault = res.data ? res.data.data : resault
    for(let i = 0; i<componentNames.length; i++) {
      if(!checkName(componentNames[i])) {
        console.log(chalk.red(`${componentNames[i]} 不符合组件命名规范(只能包含大小写字母及数字,且以字母开头)`))
        return
      }
      await createComponent(componentNames[i])
    }
  }).catch(() => {
    axios.get(_api).then(async (res) => {
      resault = res.data ? res.data.data : resault
      for(let i = 0; i<componentNames.length; i++) {
        if(!checkName(componentNames[i])) {
          console.log(chalk.red(`${componentNames[i]} 不符合组件命名规范(只能包含大小写字母及数字,且以字母开头)`))
          return
        }
        await createComponent(componentNames[i])
      }
    }).catch((e) =>{
      console.log(e)
    })
  })
}
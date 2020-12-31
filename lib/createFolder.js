const fs = require('fs')
const path = require('path')
const Creator = require('./promptModules/Creator')
const render = require('json-templater/string')
const https = require('https')
const axios = require('axios')
const api = process.env.npm_package_docs_api
const {clearConsole} = require('../utils/clearConsole')
const chalk = require('chalk')
const lowwerCase = require('../utils/formatName')
const json5 = require('json5')

let resault = {
  "BUSINESS_TAG": "[{\"business\":\"vk-report\",\"tagList\":[\"头部\",\"图表\",\"模块\",\"急促\"]},{\"business\":\"ust\",\"tagList\":[\"title\",\"prosess\",\"time\"]}]",
  "TYPE": "[\"业务组件\",\"基础组件\",\"模块\",\"物料\"]",
  "TECHNOLOGY": "[\"vue\",\"js\",\"react\",\"img\"]",
  "CLIENT": "[\"pc\",\"ipad\",\"wx\",\"mobile\",\"miniProgram\"]"
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
  name: "{{_name}}"
}
</script>
<style>

</style>
<custom>
/**
 * @version <必填><string>              {{version}}
 * @author<必填><string>                请将此处替换成邮箱前缀
 * @type<必填><string>                  单选，选项为：{{TYPE}}
 * @clientList<必填><array>             可多选,选项为：{{CLIENT}}
 * @label<选填>                         组件的中文名
 * @technologyStack<必填><string>       单选，选项为：{{TECHNOLOGY}}
 * @technologyVersion<选填><string>     当 technologyStack !=Js 时, 此项填写技术栈版本，例： 2.6.0
 * @businessList<必填><array>           
 * @tagList<必填><array>                
 * @componentBusinessTagRelationList<必填><array>  对应关系在由服务端维护
 * @applyList<必填><string>             神策event_id
 * @description<选填><string>           组件描述
 * @customData<选填><Object>            JSON
 */
const {{name}} = {
  version: "{{version}}",
  author: "{{author}}",
  type: {{type}},
  tagList: {{tagList}},
  clientList: {{clientList}},
  label: {{label}},
  technologyStack: {{technologyStack}},
  technologyVersion: {{technologyVersion}},
  businessList: {{businessList}},
  applyList: {{applyList}},
  description: {{description}},
  customData: {},
  componentBusinessTagRelationList: {{business_tag_relation}}
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
  const filePath = `./packages/${name}`
  const mkdirErr = fs.mkdirSync(filePath)
  if (mkdirErr) { // 创建文件夹失败
    if (mkdirErr.code.toUpperCase() === 'EEXIST') {
      console.log('文件夹已存在')
    } else {
      console.log('创建组件目录失败，请尝试手动创建')
      console.log(mkdirErr)
    }
  } else {
    clearConsole()
    const creator = new Creator(name, resault)
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
              _name: lowwerCase(name),
              BUSINESS: json5.parse(resault.BUSINESS_TAG).map(item =>  item.business).join(', '),
              TYPE: json5.parse(resault.TYPE).join(', '),
              TECHNOLOGY: json5.parse(resault.TECHNOLOGY).join(', '),
              CLIENT: json5.parse(resault.CLIENT).join(', '),
              version: `${answers.version}`,
              author: `${answers.author}`,
              type: `"${answers.type}"`,
              clientList: arrOrStrToArrStr(answers.clientList),
              technologyStack: `"${answers.technologyStack}"`,
              technologyVersion: `"${answers.technologyVersion}"`,
              businessList: arrOrStrToArrStr(answers.business.map(b => b.business)),
              tagList: arrOrStrToArrStr(answers.business.reduce((res, cur) => {
                return res.concat(cur.tagList)
              }, [])),
              applyList: arrOrStrToArrStr(answers.applyList),
              description: `"${answers.description}"`,
              label: `"${answers.label}"`,
              business_tag_relation: json5.stringify(answers.business)
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
  let _name = lowwerCase(name)

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
  }).catch((e) => {
    console.log(e)
  })
}
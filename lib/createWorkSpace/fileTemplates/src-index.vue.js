module.exports = (() =>{
    return `<template>
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
})()
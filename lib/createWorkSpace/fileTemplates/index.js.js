module.exports = (() => {
    return `
import {{name}} from './src/index.vue'

{{name}}.install = function(Vue) {
    Vue.component({{name}}.name, {{name}});
};

export default {{name}};
`
})()
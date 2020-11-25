var hljs = require('highlight.js')
var marked = require('marked')
var fs = require('fs')

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'html';
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});
module.exports = function(source) {
  const text = fs.readFileSync(source.resource,'utf-8')
  const content = marked(text)
  const res = `module.exports=\`${content}\``
  console.log(res)
  return  res
}